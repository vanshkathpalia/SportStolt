// src/controllers/notificationController.ts
import { Context } from 'hono'
// import { PrismaClient } from '@prisma/client/edge'
import { AcceleratedPrismaClient, getPrisma } from '~/lib/prismaClient'
// import { withAccelerate } from '@prisma/extension-accelerate'
import { sendNotification } from '../helper/sendNotification'
import { calculatePointsForStory } from '~/lib/rewardPointsCalculator';


export interface EventInterface {
    id: number;
    name: string;
    startTime: Date;
    endDate: Date;
    startDate: Date;
    state: string;
    country: string;
    stadium: string;
    city: string;
    // title: string;
    // timing: string;
    // image: string;
    // description: string;
    // authorId: number;
    // eventId: number;
    // eventName: string;
    // eventDescription: string; 
    // author: {
    //   name: string;
    //   avatar: string;
    // };
    // imageUrl: string;
    // location: string;
    // organisedBy: string;
    // username: string;
    // likes: number;
    // sportTags: string[];
    // comments: Comment[];
    // publishedDate: string;
    // isRegistered?: boolean;
}

export async function getNotifications(c: Context) {
  const prisma = getPrisma(c.env.DATABASE_URL)
  const userId = c.get('userId')

  // Fetch notifications along with sender and storyImage details
    const notifications = await prisma.notification.findMany({
        where: { receiverId: userId },
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: {
                id: true,
                name: true,
                username: true,
                image: true,
            }
            },
          storyImage: {
            select: {
                url: true,
                // isVerified: true,
            }
            },
          post: {
            select: {
                id: true,
                title: true,
                content: true,
                // PostPhoto: {
                // select: {
                //     url: true
                // },
                // take: 1 // If you only want 1 preview image
                // }
            }
          }
        }
    })


  // Map to frontend shape
    const mappedNotifications = notifications.map((notif) => {
        let message = notif.message

        if (notif.type === 'COMMENT') {
            message = `commented: "${notif.message}"`
        }

        const timeDiffMs = Date.now() - notif.createdAt.getTime()
        let time = ''
        if (timeDiffMs < 60 * 1000) time = `${Math.floor(timeDiffMs / 1000)}s ago`
        else if (timeDiffMs < 60 * 60 * 1000) time = `${Math.floor(timeDiffMs / (60 * 1000))}m ago`
        else if (timeDiffMs < 24 * 60 * 60 * 1000) time = `${Math.floor(timeDiffMs / (60 * 60 * 1000))}h ago`
        else time = `${Math.floor(timeDiffMs / (24 * 60 * 60 * 1000))}d ago`

        return {
            id: notif.id,
            type: notif.type,
            user: {
            id: notif.sender?.id ?? 0,
            name: notif.sender?.name ?? 'Unknown',
            username: notif.sender?.username ?? 'You',
            image: notif.sender?.image || '/placeholder.svg?height=40&width=40'
            },
            message,
            postId: notif.post?.id,
            postPreview: (notif.type === 'LIKE' || notif.type === 'COMMENT') ? 
            // (notif.post?.PostPhoto?.[0]?.url || '') : undefined,
            (notif.post?.content || '') : undefined,
            storyImage: notif.type === 'VERIFICATION' ? (notif.storyImage?.url || '') : undefined,
            time,
            isVerified: notif.type === 'VERIFICATION' ? notif.isVerified : undefined,
        }
    })


  console.log('mappedNotifications', mappedNotifications)

  return c.json({ notifications: mappedNotifications })
}

export async function sendNotificationController(c: Context) {
  const prisma = getPrisma(c.env.DATABASE_URL)
  const senderId = c.get('userId')
  const body = await c.req.json()

  console.log({
    type: 'LIKE',
    receiverId: body.receiverId,
    postId: body.postId,
    senderId
  })

  const { type, receiverId, postId, commentText } = body

  if (!['LIKE', 'COMMENT', 'FOLLOW'].includes(type)) {
    return c.json({ message: 'Invalid notification type' }, 400)
  }

  if (typeof receiverId !== 'number' || receiverId === senderId) {
    return c.json({ message: 'Invalid receiverId' }, 400)
  }

  if ((type === 'LIKE' || type === 'COMMENT') && !postId) {
    return c.json({ message: 'postId is required for like or comment notifications' }, 400)
  }

  let message = ''
  switch (type) {
    case 'LIKE': message = 'liked your story.'; break
    case 'COMMENT': message = `commented: ${commentText || '...'}.`; break
    case 'FOLLOW': message = 'started following you.'; break
  }

  try {
    const result = await sendNotification({
      prisma,
      type,
      senderId,
      receiverId,
      message,
      postId
    })

    return c.json({ message: 'Notification sent', notification: result })
  } catch (err) {
    console.error('Send notification error:', err)
    return c.json({ message: 'Internal server error' }, 500)
  }
}

export async function getEventNotifications(c: Context) {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const userId = c.get("userId");

  const preference = await prisma.userPreference.findUnique({
    where: { userId },
  });

  if (!preference) return c.json({ notifications: [] });

  const preferredSports = preference.preferredSports;
  const preferredLocations = preference.preferredLocations;

  const events = await prisma.event.findMany({
    where: {
      OR: [
        {
          // name: {
          //   in: preferredSports,
          //   mode: "insensitive",
          // },
          isArchived: false,
        },
      ],
      AND: [
        {
          OR: [
            {
              city: {
                in: preferredLocations,
                mode: "insensitive",
              },
            },
            {
              state: {
                in: preferredLocations,
                mode: "insensitive",
              },
            },
          ],
        },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  const eventNotifications = events.map((event) => {
    const timeDiff = Date.now() - new Date(event.createdAt).getTime();
    let time = "";
    if (timeDiff < 60 * 1000) time = `${Math.floor(timeDiff / 1000)}s ago`;
    else if (timeDiff < 60 * 60 * 1000) time = `${Math.floor(timeDiff / (60 * 1000))}m ago`;
    else if (timeDiff < 24 * 60 * 60 * 1000) time = `${Math.floor(timeDiff / (60 * 60 * 1000))}h ago`;
    else time = `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))}d ago`;

    return {
      id: event.id,
      type: "EVENT",
      message: `Event: ${event.name} in ${event.city}`,
      time,
      timeAsDate: event.createdAt,
      eventId: event.id,
      postPreview: event.image,
      user: {
        id: 0,
        username: event.OrganisedBy || "Organizer",
        image: "/placeholder.svg?height=40&width=40",
      },
    };
  });

  return c.json({ notifications: eventNotifications });
}

export const sendEventNotification = async (
  prisma: AcceleratedPrismaClient,
  event: EventInterface,
  senderId: number
) => {
  const interestedUsers = await prisma.userPreference.findMany({
    where: {
      preferredSports: { has: event.name },
      preferredLocations: { hasSome: [event.city, event.state] },
    },
    select: { userId: true },
  });

  for (const { userId: receiverId } of interestedUsers) {
    if (receiverId === senderId) continue;

    await prisma.notification.create({
      data: {
        type: "EVENT",
        message: `Posted a new event.`,
        senderId,
        receiverId,
        scheduledAt: new Date(),
        eventId: event.id,
      },
    });
  }
};

export async function verifyNotificationController(c: Context) {
  const prisma = getPrisma(c.env.DATABASE_URL)
  try {
    const { notificationId, isVerified } = await c.req.json()
    const userId = c.get('userId')

    if (typeof notificationId !== "number" || typeof isVerified !== "boolean") {
      return c.json({ message: "Invalid input" }, 400)
    }

    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
      include: { storyImage: true }
    })

    if (!notification || !notification.storyImage) {
      return c.json({ message: "Notification or story image not found" }, 404)
    }

    if (notification.isVerified !== null) {
      return c.json({ message: "Already verified" }, 400);
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { 
        seen: true,
        isVerified,
      }
    });

    const updated = await prisma.storyimages.update({
      where: { id: notification.storyImageId! },
      data: {
        verifiedBy: { push: userId },
        verificationCount: { increment: isVerified ? 1 : 0 },
        totalReviews: { increment: 1 }
      },
      include: {
        story: {
          include: {
            Storyimages: true,
            attendees: true,
          }
        }
      }
    });

    const story = updated.story;
    if (!story) return c.json({ message: "Story not found" }, 404);

    const earnedPoints = await calculatePointsForStory(story);

    // Add points to the author
    await prisma.user.update({
      where: { id: story.authorId },
      data: { points: { increment: earnedPoints } }
    });

    // Optional: Notify author
    await sendNotification({
      prisma,
      type: "INFO",
      senderId: userId, // or story.authorId if self, or 0 for system
      receiverId: story.authorId,
      message: `You earned ${earnedPoints} points from your story at ${story.stadium}!`,
      scheduledAt: new Date()
    })

    return c.json({ message: 'Verification recorded', updatedStoryImage: updated })
  } catch (err) {
    console.error('Verify error:', err)
    return c.json({ message: 'Internal server error' }, 500)
  }
}


// import { Hono } from 'hono'
// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
// import { verify } from 'hono/jwt'
// // import { number, string, z } from "zod"
// // import axios from 'axios';

// export const notificationRouter = new Hono<{
//     Bindings: {
//         DATABASE_URL: string;
//         JWT_SECRET: string;
//       } 
//     Variables: {
//         userId: number;
//     }
// }>();

// // this is uncessary i guess we have seperate logic for this 
// notificationRouter.use('/*', async (c, next) => {
//     if (c.req.method === 'OPTIONS') {
//         console.log('Preflight OPTIONS request received');
//         c.status(204); // Preflight requests must return 204
//         return c.text('');
//     }

//     const authHeader = c.req.header("authorization")?.replace("Bearer ", "") || "";
//     const user = await verify(authHeader, c.env.JWT_SECRET);
//     if (user && typeof user.id === "number") {
//         c.set("userId", user.id);
//         return next();
//     } else {
//         c.status(403);
//         return c.json({ message: "Invalid token, you are not logged in" }, 403);
//     }
// });


// notificationRouter.get('/', async (c) => {
//     const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
  
//     try {
//       const userId = c.get('userId'); // This is set by your JWT middleware
//       if (!userId) {
//         c.status(403);
//         return c.json({ message: "Unauthorized" });
//       }
  
//       // Fetch notifications where the logged-in user is the receiver.
//       // Adjust the order and selection as needed.
//       const notifications = await prisma.notification.findMany({
//         where: { receiverId: userId },
//         orderBy: { createdAt: 'desc' },
//         select: {
//           id: true,
//           type: true,
//           message: true,
//           createdAt: true,
//           seen: true,
//           // Include additional relations if necessary
//           // e.g. storyImage: { select: { url: true } },
//           // or sender: { select: { name: true, avatar: true } }
//         }
//       });
  
//       return c.json({ notifications });
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       c.status(500);
//       return c.json({ message: "Error fetching notifications" });
//     }
//   });
  

// notificationRouter.post('/verify', async (c) => {
//     const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
//     try {
//         const body = await c.req.json();
//         console.log("Received body:", JSON.stringify(body, null, 2));

//         const { notificationId, isVerified, userId } = body;
//         if (typeof notificationId !== "number" || typeof isVerified !== "boolean" || typeof userId !== "number") {
//             c.status(400);
//             return c.json({ message: "Invalid input data" });
//         }

//         // Fetch notification
//         const notification = await prisma.notification.findUnique({
//             where: { id: notificationId },
//             include: { storyImage: true }
//         });

//         if (!notification || !notification.storyImage) {
//             c.status(404);
//             return c.json({ message: "Notification or associated Story Image not found" });
//         }

//         const storyImageId = notification.storyImageId;

//         // Update Notification
//         await prisma.notification.update({
//             where: { id: notificationId },
//             data: { seen: true }
//         });

//         // Ensure storyImageId is not null or undefined before proceeding
//         if (storyImageId === null || storyImageId === undefined) {
//             c.status(400);
//             return c.json({ message: "Invalid storyImageId" });
//         }
  

//         // Update StoryImages
//         const updatedStoryImage = await prisma.storyimages.update({
//             where: { id: storyImageId },
//             data: {
//                 verifiedBy: { push: userId }, // Add user to verifiedBy array
//                 verificationCount: { increment: isVerified ? 1 : 0 },
//                 totalReviews: { increment: 1 } 
//             }
//         });

//         console.log("Updated Story Image:", updatedStoryImage);

//         // Check if verification threshold met for rewards
//         if (updatedStoryImage.verificationCount >= 5) { // Example threshold
//             await prisma.story.update({
//                 where: { id: updatedStoryImage.storyId },
//                 data: { rewardStatus: "eligible" }
//             });

//             console.log(`Story ${updatedStoryImage.storyId} is now eligible for rewards`);
//         }

//         return c.json({ message: "Verification recorded successfully", updatedStoryImage });

//     } catch (error) {
//         console.error(error);
//         c.status(500);
//         return c.json({ message: "Error processing verification" });
//     }
// });

