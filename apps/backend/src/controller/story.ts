import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
// import { createstoryInput, updatestoryInput } from '@vanshkathpalia/sportstolt-common'
import { date, string, z } from "zod"

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
    image: z.string().min(1, 'https://www.gettyimages.in/detail/photo/hisar-kapiya-old-plovdiv-by-omgwrks-com-royalty-free-image/987624358?adppopup=true'),
    // image: z
    // .any()
    // .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    // .refine(
    //   (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
    //   "Only .jpg, .jpeg, .png and .webp formats are supported."
    isViewed: z.boolean().optional(),
    location: z.string().min(1, 'hisar'),
    // createdAt: z.date(),
});

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

//story  location is like author id in story 
storyRouter.post('/', async (c) => {
    const body = await c.req.json();
    // console.log(body);
    try {
        const body = await c.req.json();
        console.log(body);

        const { success } = createStoryInput.safeParse(body); 
            if(!success) {
            c.status(411);
            return c.json({
                message: "invalid"
            })
        }
        

        const authorId = c.get("userId");
        if (!authorId) {
            c.status(403);
            c.json({ message: "User not authenticated" });
            return;
        }

        if (!c.env.DATABASE_URL) {
            c.status(500);
            c.json({ message: "DATABASE_URL is not set" });
            return;
        }
        // const prisma = new PrismaClient({
        //     datasourceUrl: c.env.DATABASE_URL,
        // }).$extends(withAccelerate());
        const prisma = new PrismaClient({
            datasources: {
                db: { url: c.env.DATABASE_URL },
            },
        });
        // prisma.$connect()
        // .then(() => console.log('Prisma connected'))
        // .catch((error) => console.error('Prisma connection error:', error));


        const story = await prisma.story.create({
            data: {
                isViewed: body.isViewed,
                location: body.location,
                image: body.image,
                authorId: Number(authorId),
            }
        })
        if (story) {
            console.log("checking");
        }

        return c.json({
            id: story.id
        });
    } catch(error) {
        console.error("Unhandled error:", error);
        c.status(500);
        c.json({ message: "Internal server error" });
    }
})


storyRouter.get('/bulk', async (c) => {
    
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
      }).$extends(withAccelerate())
    const authorId = c.get("userId")

    const stories = await prisma.story.findMany({
        select: {
            location: true,
            image: true,
            isViewed: true,
            createdAt: true,
            id: true,
            author: {
                select: {
                    name: true
                }
            }
        }
    });
    
    return c.json({
        stories,
    })
})


/* user posting stories is authentic or not */
// Check Image Authenticity (pseudo code for object identification)
// async function checkImageAuthenticity(imageUrl: string): Promise<boolean> {
//     // Integrate with an object detection API or use your own model
//     const isAuthentic = await objectDetectionAPI(imageUrl);
//     return isAuthentic;
//   }
  
//   // Review Story and Update Rating
//   async function reviewStory(storyId: string, userId: string, rating: number, content: string) {
//     // Store review
//     const review = await prisma.review.create({
//       data: {
//         content: content,
//         rating: rating,
//         reviewer: userId,
//         storyId: storyId,
//       },
//     });
  
//     // Update Story Rating (calculate average)
//     const story = await prisma.story.findUnique({
//       where: { id: storyId },
//       include: { reviews: true },
//     });
  
//     const avgRating = story.reviews.reduce((sum, review) => sum + review.rating, 0) / story.reviews.length;
  
//     await prisma.story.update({
//       where: { id: storyId },
//       data: {
//         rating: avgRating,
//       },
//     });
//   }
  
//   // Authenticity and Reward Points
//   async function authenticateAndReward(storyId: string, userId: string) {
//     // Check all images in the story for authenticity
//     const story = await prisma.story.findUnique({
//       where: { id: storyId },
//       include: { images: true },
//     });
  
//     const authenticityPromises = story.images.map(async (imageUrl) => checkImageAuthenticity(imageUrl));
//     const results = await Promise.all(authenticityPromises);
  
//     const isAuthentic = results.every(result => result); // If all images are authentic
  
//     if (isAuthentic) {
//       // Award points to user
//       await prisma.user.update({
//         where: { id: userId },
//         data: { points: { increment: 10 } }, // Add points (e.g., 10 points)
//       });
  
//       // Award badge to the user
//       await prisma.badge.create({
//         data: {
//           name: "Verified Creator",
//           userId: userId,
//         },
//       });
  
//       // Update story authenticity status
//       await prisma.story.update({
//         where: { id: storyId },
//         data: { authenticityStatus: "verified" },
//       });
//     } else {
//       // Mark as not verified
//       await prisma.story.update({
//         where: { id: storyId },
//         data: { authenticityStatus: "not_verified" },
//       });
//     }
//   }
  

