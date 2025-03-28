import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
// import { number, string, z } from "zod"
// import axios from 'axios';

export const notificationRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      } 
    Variables: {
        userId: number;
    }
}>();

notificationRouter.use('/*', async (c, next) => {
    if (c.req.method === 'OPTIONS') {
        console.log('Preflight OPTIONS request received');
        c.status(204); // Preflight requests must return 204
        return c.text('');
    }

    const authHeader = c.req.header("authorization")?.replace("Bearer ", "") || "";
    const user = await verify(authHeader, c.env.JWT_SECRET);
    if (user && typeof user.id === "number") {
        c.set("userId", user.id);
        return next();
    } else {
        c.status(403);
        return c.json({ message: "Invalid token, you are not logged in" }, 403);
    }
});


notificationRouter.get('/', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
    try {
      const userId = c.get('userId'); // This is set by your JWT middleware
      if (!userId) {
        c.status(403);
        return c.json({ message: "Unauthorized" });
      }
  
      // Fetch notifications where the logged-in user is the receiver.
      // Adjust the order and selection as needed.
      const notifications = await prisma.notification.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          type: true,
          message: true,
          createdAt: true,
          seen: true,
          // Include additional relations if necessary
          // e.g. storyImage: { select: { url: true } },
          // or sender: { select: { name: true, avatar: true } }
        }
      });
  
      return c.json({ notifications });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      c.status(500);
      return c.json({ message: "Error fetching notifications" });
    }
  });
  

notificationRouter.post('/verify', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    try {
        const body = await c.req.json();
        console.log("Received body:", JSON.stringify(body, null, 2));

        const { notificationId, isVerified, userId } = body;
        if (typeof notificationId !== "number" || typeof isVerified !== "boolean" || typeof userId !== "number") {
            c.status(400);
            return c.json({ message: "Invalid input data" });
        }

        // Fetch notification
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
            include: { storyImage: true }
        });

        if (!notification || !notification.storyImage) {
            c.status(404);
            return c.json({ message: "Notification or associated Story Image not found" });
        }

        const storyImageId = notification.storyImageId;

        // Update Notification
        await prisma.notification.update({
            where: { id: notificationId },
            data: { seen: true }
        });

        // Ensure storyImageId is not null or undefined before proceeding
        if (storyImageId === null || storyImageId === undefined) {
            c.status(400);
            return c.json({ message: "Invalid storyImageId" });
        }
  

        // Update StoryImages
        const updatedStoryImage = await prisma.storyimages.update({
            where: { id: storyImageId },
            data: {
                verifiedBy: { push: userId }, // Add user to verifiedBy array
                verificationCount: { increment: isVerified ? 1 : 0 },
                totalReviews: { increment: 1 } 
            }
        });

        console.log("Updated Story Image:", updatedStoryImage);

        // Check if verification threshold met for rewards
        if (updatedStoryImage.verificationCount >= 5) { // Example threshold
            await prisma.story.update({
                where: { id: updatedStoryImage.storyImageId },
                data: { rewardStatus: "eligible" }
            });

            console.log(`Story ${updatedStoryImage.storyImageId} is now eligible for rewards`);
        }

        return c.json({ message: "Verification recorded successfully", updatedStoryImage });

    } catch (error) {
        console.error(error);
        c.status(500);
        return c.json({ message: "Error processing verification" });
    }
});

