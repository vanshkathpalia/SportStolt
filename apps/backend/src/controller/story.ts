import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
import { number, string, z } from "zod"
import axios from 'axios';

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
    imageId: z.number(),
    verified: z.boolean()
});


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
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user && typeof user.id === "number") {
        c.set("userId", user.id);
        return next();
    } else {
        c.status(403);
        return c.json({ message: "Invalid token, you are not logged in" }, 403);
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

        const today = new Date();
        const datePart = today.toISOString().split('T')[0]; // e.g., "2025-03-21"

        // Combine date with received time (hh:mmZ)
        const combinedEndTime = `${datePart}T${body.activityEnded}`;
        const combinedStartTime = `${datePart}T${body.activityStarted}`;

        const activityEnded = new Date(combinedEndTime);
        const activityStarted = new Date(combinedStartTime);

        if (activityEnded <= activityStarted) {
            c.status(400);
            return c.json({ message: "Activity Ended time must be after Activity Started time." });
        }
        
        const endTime = new Date(activityEnded.getTime() + 60 * 60 * 1000);
        

        console.log("Activity Ended:", activityEnded.toISOString());
        console.log("Story Expires At:", endTime.toISOString());

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
                storyImageId: existingStory.id,
                UserId: userId,
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

        const existingVerification = await prisma.verification.findFirst({
            where: {
                verificationId: storyId,
                userId: userId
            }
        });

        if (existingVerification) {
            return c.json({ message: "You have already verified this story." });
        }

        // Create a verification record
        await prisma.verification.create({
            data: {
                verificationId: storyId,
                userId: userId,
                verified: verified
            }
        });

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

        // Fetch the updated story verification count
        const story = await prisma.story.update({
            where: { id: storyId },
            data: {
                verificationCount: { increment: verified ? 1 : 0 }
            }
        });

        // If a certain number of verifications is reached, mark the story as verified
        if (story.verificationCount >= 3) {
            await prisma.story.update({
                where: { id: storyId },
                data: {
                    authenticityStatus: "verified",
                    rewardStatus: "eligible"
                }
            });

            // Give **points** to the author of the story
            await prisma.user.update({
                where: { id: story.authorId },
                data: {
                    points: { increment: 20 } // Reward points for getting a story verified
                }
            });
        }

        // Give **points** to the user for verifying
        // await prisma.user.update({
        //     where: { id: userId },
        //     data: {
        //         points: { increment: 5 } // Reward points for verifying
        //     }
        // });

        // Update story verification count and status
        // const story = await prisma.story.update({
        //     where: { id: storyId },
        //     data: {
        //         verificationCount: {
        //             increment: verified ? 1 : 0
        //         },
        //         authenticityStatus: verified ? "verified" : "not_verified",
        //         rewardStatus: verified ? "eligible" : "pending"
        //     }
        // });

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
                Storyimages: { select: { url: true, UserId: true } } as any,
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
            where: { storyImageId: story.id }
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
