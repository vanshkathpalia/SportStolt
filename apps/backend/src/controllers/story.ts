import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
// import { verify } from 'hono/jwt'
import { z } from "zod"
import axios from 'axios';
// import { addHours } from 'date-fns';
import { authMiddleware } from '../middleware/authMiddleware'
import { getPrisma } from '~/lib/prismaClient';

export const storyRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      } 
    Variables: {
        userId: number;
    }
}>();

const viewStoryInput = z.object({
    storyId: z.number(),
    isViewed: z.boolean().optional()
});

const createStoryInput = z.object({
    locationImage: z.string().min(1, 'Image URL is required'),
    images: z.array(z.number()).optional(),
    isViewed: z.boolean().optional(),
    location: z.string().min(1, 'Location is required'),
    description: z.string().optional(),
    participants: z.number().optional().default(0),
    sport: z.string().min(1, 'Sport type is required'),
    stadium: z.string().optional(),
    swipeUpEnabled: z.boolean().optional()
});

const verifyStoryInput = z.object({
    storyId: z.number(),
    imageId: z.number(),
    verified: z.boolean()
});


async function fetchLocationImage(location: string,): Promise<string | null> {
    const API_KEY = 'HumkAY45IhFQNjKoq50xxWo1b619Te5RmwhC9Ti0O8Bx09tdBS2hPxOp'; 
    const pexelsUrl = `https://api.pexels.com/v1/search?query=${encodeURIComponent(location)}&per_page=1`;

    try {
        const response = await axios.get(pexelsUrl, {
            headers: { Authorization: API_KEY },
        });

        // Ensure the response has photos and extract the first image URL
        return response.data?.photos?.[0]?.src?.large || null;
    } catch (error) {
        console.error("Error fetching location image:", error);
        return null;
    }
}


storyRouter.use('/*', authMiddleware);
// Middleware to check if the user is authenticated

storyRouter.post('/', async (c) => {
    const body = await c.req.json();
    console.log("Received body:", JSON.stringify(body, null, 2));

    const parseResult = createStoryInput.safeParse(body);
    if (!parseResult.success) {
        console.error("Validation Errors:", parseResult.error.errors);
        c.status(400);
        return c.json({ 
            message: "Invalid input", 
            errors: parseResult.error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))
        });
    }

    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const userId = c.get('userId');

        const today = new Date();
        const datePart = today.toISOString().split('T')[0];

        const combinedEndTime = `${datePart}T${body.activityEnded}`;
        const combinedstartTime = `${datePart}T${body.activityStarted}`;

        const activityEnded = new Date(combinedEndTime);
        const activityStarted = new Date(combinedstartTime);

        if (activityEnded <= activityStarted) {
            c.status(400);
            return c.json({ message: "Activity Ended time must be after Activity Started time." });
        }

        const endTime = new Date(activityEnded.getTime() + 60 * 60 * 1000);

        console.log("Activity Ended:", activityEnded.toISOString());
        console.log("Story Expires At:", endTime.toISOString());

        // Look for a matching story with same location, sport, stadium, user, and activity times
        const matchingStory = await prisma.story.findFirst({
            where: {
                isArchived: false,
                location: body.location,
                sport: body.sport,
                stadium: body.stadium || "",
                authorId: userId,
                activityStarted,
                activityEnded
            }
        });

        let finalStory = matchingStory;

        if (!matchingStory) {
            const locationImage = await fetchLocationImage(body.location);

            finalStory = await prisma.story.create({
                data: {
                    location: body.location,
                    sport: body.sport,
                    stadium: body.stadium || "",
                    description: body.description,
                    authorId: userId,
                    authenticityStatus: "pending",
                    duration: 60,
                    activityStarted,
                    activityEnded,
                    endTime,
                    swipeUpEnabled: true,
                    participants: typeof body.participants === "number" ? body.participants : undefined,
                    rating: 0,
                    verificationCount: 0,
                    rewardStatus: "pending",
                    isViewed: false,
                    rewardAmount: null,
                    locationImage,
                }
            });
        }

        if (!finalStory) {
            c.status(500);
            return c.json({ message: "Failed to create or find a valid story" });
        }

        const storyImage = await prisma.storyimages.create({
            data: {
                url: body.image,
                storyId: finalStory.id,
                userId: userId,
                authenticityChecked: false,
                verifiedBy: [],
            }
        });

        return c.json({
            message: matchingStory ? "Existing story found, added image." : "New story created successfully",
            story: finalStory,
            storyImage
        });

    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Error while creating story" });
    }
});

storyRouter.get('/fetch', async (c) => {
    const prisma = getPrisma(c.env.DATABASE_URL);
    const userId = c.get('userId');
    const filterBy = c.req.query('filterBy');

    // console.log('Fetching stories with filter:', filterBy);
    // console.log('User ID:', userId);

    // Get current time in UTC
    const utcNow = new Date();
    // console.log('Current UTC time:', utcNow);

    // Base where clause - only get stories that haven't ended yet
    let whereClause: any = {isArchived: false};

    // Only apply preference filtering if filterBy is specified
    if (filterBy) {
        // Fetch user preferences
        const userPrefs = await prisma.userPreference.findUnique({
            where: { userId },
            select: {
                preferredSports: true,
                preferredLocations: true,
            },
        });

        // console.log('User preferences:', userPrefs);

        // Add preference-based filtering only if preferences exist
        if (filterBy === 'location' && userPrefs?.preferredLocations?.length) {
            whereClause.location = {
                in: userPrefs.preferredLocations,
                mode: 'insensitive',
            };
            // console.log('Filtering by locations:', userPrefs.preferredLocations);
        } else if (filterBy === 'sport' && userPrefs?.preferredSports?.length) {
            whereClause.sport = {
                in: userPrefs.preferredSports,
                mode: 'insensitive',
            };
            // console.log('Filtering by sports:', userPrefs.preferredSports);
        }
    }

    // console.log('Final where clause:', whereClause);

    // First, let's get all stories to see what we have
    const allStories = await prisma.story.findMany({
        select: {
            id: true,
            location: true,
            sport: true,
            endTime: true,
            activityStarted: true,
            activityEnded: true,
        }
    });
    // console.log('All stories in DB:', allStories);

    // Now get the filtered stories
    const stories = await prisma.story.findMany({
        where: whereClause,
        select: {
            id: true,
            location: true,
            sport: true,
            locationImage: true,
            createdAt: true,
            activityStarted: true,
            activityEnded: true,
            endTime: true,
            description: true,
            stadium: true,
            swipeUpEnabled: true,
            participants: true,
            authenticityStatus: true,
            Storyimages: { 
                select: { 
                    id: true, 
                    url: true, 
                    userId: true 
                } 
            },
            author: { 
                select: { 
                    id: true, 
                    username: true, 
                    image: true 
                } 
            },
            StoryView: userId ? {
                where: { userId },
                select: { id: true }
            } : false
        },
        orderBy: [
            { activityStarted: 'asc' },
            { activityEnded: 'asc' },
        ]
    });

    // console.log('Found stories:', stories.length);

    // Filter out stories that have ended
    const activeStories = stories.filter(story => {
        const endTime = new Date(story.endTime);
        return endTime > utcNow;
    });

    // console.log('Active stories after filtering:', activeStories.length);

    // Add isViewed flag and format response
    const formattedStories = activeStories.map(story => ({
        ...story,
        isViewed: story.StoryView?.length > 0
    }));

    // Sort stories: upcoming activities first, then by isViewed status
    formattedStories.sort((a, b) => {
        // First sort by activity start time
        const aStarted = new Date(a.activityStarted);
        const bStarted = new Date(b.activityStarted);
        
        if (aStarted > bStarted) return 1;
        if (aStarted < bStarted) return -1;
        
        // If same start time, unisViewed stories come first
        if (a.isViewed === b.isViewed) return 0;
        return a.isViewed ? 1 : -1;
    });

    console.log('Final formatted stories: (last one)', formattedStories[formattedStories.length - 1]);
    return c.json({ stories: formattedStories });
    // return c.json({ stories: activeStories });
});

storyRouter.get('/points', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const userId = c.get('userId');
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { points: true }
        });

        return c.json({ points: user?.points ?? 0 });

    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Error fetching points" });
    }
});

storyRouter.post("/will-go", async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const receivedData = await c.req.json();
        const storyImageId = Number(receivedData.storyImageId);
        const userId = c.get("userId"); 
        const storyId = receivedData.storyId ? Number(receivedData.storyId) : null;

        const existingStoryImage = await prisma.storyimages.findUnique({
        where: { id: storyImageId },
        });

        // maybe change it to 
        // const existingStoryImage = await prisma.story.findUnique({
        //     where: { id: storyId },
        // });

        if (!existingStoryImage) {
        throw new Error("Invalid storyImageId: Does not exist in Storyimages table");
        }

        const existingAttendance = await prisma.storyAttendance.findFirst({
            where: { storyImageId, userId },
        });
      
        if (existingAttendance) {
        return c.json({ message: "User already marked as attending." }, 400);
        }

        if (storyId === null) {
            throw new Error('storyId is null');
        }

        await prisma.storyAttendance.create({
        data: {
            storyImageId,
            userId,
            // isVerified: false,
            // attendedAt: new Date(),  // Automatically converts to Prisma DateTime
            storyId,
        },
        });

        // Get story end time
        const storyImage = await prisma.storyimages.findUnique({
            where: { id: storyImageId },
            select: { story: { select: { activityEnded: true } } },
        });

        if (!storyImage) {
            return c.json({ message: "Story image not found." }, 404);
        }

        return c.json({ message: "Attendance recorded. Notification scheduled." });
    } catch (error) {
        console.error("Error marking attendance:", error);
        return c.json({ message: "Internal server error" }, 500);
    }
});

storyRouter.delete('/', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const { id, location, sport } = await c.req.json();

        if (!id && !location && !sport) {
            c.status(400);
            return c.json({ message: "Provide at least one identifier: id, location, or sport" });
        }
        
        // let filter: any = {};

        // if (id) {
        // filter.id = id;
        // } else {
        // if (location) filter.location = location;
        // if (sport) filter.sport = sport;
        // }

        // Build the filter
        const filter = id
            ? { id }
            : {
                ...(location && { location }),
                ...(sport && { sport }),
            };

        // Find all matching stories
        const stories = await prisma.story.findMany({ where: filter });

        if (!stories.length) {
            c.status(404);
            return c.json({ message: "No stories found matching the criteria." });
        }

        const storyIds = stories.map(story => story.id);

        await prisma.storyView.deleteMany({
            where: {
                storyId: {
                    in: storyIds
                }
            }
        });

        // Delete all associated StoryImages
        // even if i comment it, story gets deleted -> not foreign key constraint -> @@unique in schema
        await prisma.storyimages.deleteMany({
            where: {
                storyId: {
                    in: storyIds
                }
            }
        });

        // Delete all matching stories
        await prisma.story.deleteMany({
            where: {
                id: {
                    in: storyIds
                }
            }
        });

        return c.json({ message: `Deleted ${storyIds.length} story(ies) successfully.` });
    } catch (e) {
        console.error("Error deleting story:", e);
        c.status(500);
        return c.json({ message: "Error while deleting story/stories." });
    }
});
