import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { number, string, z } from "zod"

export const storyRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      } 
    Variables: {
        userId: number;
    }
}>();

const createStoryInput = z.object({
    locationImage: z.string().min(1, 'Image URL is required'),
    images: z.array(z.number()).optional(),
    isViewed: z.boolean().optional(),
    location: z.string().min(1, 'Location is required'),
    description: z.string().optional(),
    eventLink: z.string().url().optional(),
    sport: z.string().min(1, 'Sport type is required'),
    stadium: z.string().optional(),
    swipeUpEnabled: z.boolean().optional()
});

const verifyStoryInput = z.object({
    storyId: z.number(),
    imageId: z.string(),
    verified: z.boolean()
});

/**
 * Fetches an image URL for a given location from the Pexels API.
 * 
 * @param {string} location - The name of the location to search for.
 * @returns {Promise<string | null>} - A promise that resolves to the URL of the location's image or null if no image is found.
 * 
 * This function uses the Pexels API to search for images related to the provided location.
 * It returns the URL of the first image in the search results, if available.
 * In case of an error or if no images are found, the function returns null.
 */
import axios from 'axios';

async function fetchLocationImage(location: string): Promise<string | null> {
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


storyRouter.use('/*', async (c, next) => {
    if (c.req.method === 'OPTIONS') {
        console.log('Preflight OPTIONS request received');
        c.status(204); // Preflight requests must return 204
        return c.text('');
    }

    const authHeader = c.req.header("authorization") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET)
    if (user && typeof user.id === "number") {
        c.set("userId", user.id);
        await next();
    }
    else {
        c.status(403);
        c.json({
            message: "you are not logged in"
        })
    }
});

// Create story with enhanced details
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
        const activityStarted = new Date(body.activityStarted);
        const activityEnded = new Date(body.activityEnded);

        if (activityEnded <= activityStarted) {
            c.status(400);
            return c.json({ message: "Activity Ended time must be after Activity Started time." });
        }

        const endTime = new Date();
        endTime.setHours(activityEnded.getHours() + 1); // Story expires in 1 hour

        // Check if a story already exists for this location & sport
        let existingStory = await prisma.story.findFirst({
            where: { location: body.location, sport: body.sport }
        });

        if (!existingStory) {
            // Fetch location image only for a new story
            const locationImage = await fetchLocationImage(body.location);

            existingStory = await prisma.story.create({
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
                    eventLink: body.eventLink || null,
                    rating: 0, // Initialize rating as 0
                    verificationCount: 0,
                    rewardStatus: "pending",
                    rewardAmount: null,
                    isViewed: false,
                    locationImage,
                }
            });
        }

        // Add the user's uploaded image to Storyimages
        const storyImage = await prisma.storyimages.create({
            data: {
                url: body.image,
                storyId: existingStory.id,
                UserID: userId,
                authenticityChecked: false
            }
        });

        return c.json({
            message: "Story created successfully",
            story: existingStory,
            storyImage
        });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Error while creating story" });
    }
});



// Verify story content
storyRouter.post('/verify', async (c) => {
    const body = await c.req.json();
    const { success } = verifyStoryInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Invalid input"
        });
    }

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const userId = c.get('userId');
        const { storyId, imageId, verified } = body;

        // Update the story image verification
        const storyImage = await prisma.storyimages.update({
            where: { id: imageId },
            data: {
                authenticityChecked: true,
                verifiedBy: {
                    push: userId
                }
            }
        });

        // Update story verification count and status
        const story = await prisma.story.update({
            where: { id: storyId },
            data: {
                verificationCount: {
                    increment: verified ? 1 : 0
                },
                authenticityStatus: verified ? "verified" : "not_verified",
                rewardStatus: verified ? "eligible" : "pending"
            }
        });

        return c.json({
            message: "Story verification updated",
            story,
            storyImage
        });
    } catch (e) {
        console.error(e);
        c.status(411);
        return c.json({
            message: "Error while verifying story"
        });
    }
});

storyRouter.get('/bulk', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

    try {
        const stories = await prisma.story.findMany({
            where: { endTime: { gte: new Date() } }, // Fetch only non-expired stories
            select: {
                id: true,
                location: true,
                sport: true,
                locationImage: true, // Include location image in response
                createdAt: true,
                activityStarted: true,  
                activityEnded: true,
                endTime: true,
                description: true,
                stadium: true,
                swipeUpEnabled: true,
                Storyimages: { select: { url: true, UserID: true } } as any,
                author: { select: { name: true, image: true } }
            },
            orderBy: [{ sport: 'asc' }, { location: 'asc' }] // Group by sport & location
        });

        return c.json({ stories });
    } catch (e) {
        console.error(e);
        c.status(500);
        return c.json({ message: "Error fetching stories" });
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

        // Find the story based on the provided identifier
        const story = await prisma.story.findFirst({
            where: {
                OR: [
                    id ? { id } : {},
                    location ? { location } : {},
                    sport ? { sport } : {}
                ]
            }
        });

        if (!story) {
            c.status(404);
            return c.json({ message: "Story not found" });
        }

        // Delete associated images first (to avoid foreign key constraint issues)
        await prisma.storyimages.deleteMany({
            where: { storyId: story.id }
        });

        // Now delete the story
        await prisma.story.delete({
            where: { id: story.id }
        });

        return c.json({ message: "Story deleted successfully" });
    } catch (e) {
        console.error("Error deleting story:", e);
        c.status(500);
        return c.json({ message: "Error while deleting story" });
    }
});
