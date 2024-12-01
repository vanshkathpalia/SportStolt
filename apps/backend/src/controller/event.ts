import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
// import { createstoryInput, updatestoryInput } from '@vanshkathpalia/sportstolt-common'
import { date, string, z } from "zod"

export const eventRouter = new Hono<{
    Bindings: {
        DATABASE_URL: string;
        JWT_SECRET: string;
      } 
    Variables: {
        userId: number;
    }
}>();

const createEventInput = z.object({
    image: z.string().min(1, { message: 'Image URL is required' }), // Image URL must be non-empty
    city: z.string().min(1, { message: 'City is necessary field'}),
    stadium: z.string().min(1, { message: 'Stadium name is required' }), // Stadium name must be non-empty
    StartDate: z.string().datetime({ message: 'StartDate must be a valid ISO datetime' }), // ISO datetime string
    EndDate: z.string().datetime({ message: 'EndDate must be a valid ISO datetime' }), // ISO datetime string
    StartTime: z.string().datetime({ message: 'StartTime must be a valid ISO datetime' }), // ISO datetime string
  });

eventRouter.use('/*', async (c, next) => {
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

eventRouter.post('/', async (c) => {
    try {
        // Parse the incoming request body
        const body = await c.req.json();
        console.log(body);

        // Validate the input using a schema (e.g., Zod)
        const { success } = createEventInput.safeParse(body); 
        if (!success) {
            c.status(411);
            return c.json({
                message: "Invalid input"
            });
        }

        // Extract userId from the context (authentication layer)
        const userId = c.get("userId");
        if (!userId) {
            c.status(403);
            return c.json({ message: "User not authenticated" });
        }

        // Ensure DATABASE_URL is set
        if (!c.env.DATABASE_URL) {
            c.status(500);
            return c.json({ message: "DATABASE_URL is not set" });
        }

        // Initialize PrismaClient with database URL
        const prisma = new PrismaClient({
            datasources: {
                db: { url: c.env.DATABASE_URL },
            },
        });

        // Create the event in the database
        const event = await prisma.event.create({
            data: {
              image: body.image,
              city: body.city,
              authorId: Number(userId), // Authenticated user's ID
              stadium: body.stadium,
              StartDate: new Date(body.StartDate),
              EndDate: new Date(body.EndDate),
              StartTime: new Date(body.StartTime),
              OrganisedBy: body.OrganisedBy
            },
          });
      

        // Return the created event ID in the response
        return c.json({
            id: event.id,
        });
    } catch (error) {
        console.error("Unhandled error:", error);
        c.status(500);
        return c.json({ message: "Internal server error" });
    }
});


eventRouter.get('/bulk', async (c) => {
    try {
      // Ensure DATABASE_URL is set
      if (!c.env.DATABASE_URL) {
        return c.json({ message: "DATABASE_URL is not set" }, 500);
      }
  
      // Initialize PrismaClient with database URL
      const prisma = new PrismaClient({
        datasources: {
          db: { url: c.env.DATABASE_URL },
        },
      });
  
      // Fetch all events from the database
      const events = await prisma.event.findMany({
        select: {
          id: true,
          image: true,
          city: true,
          authorId: true,
          stadium: true,
          StartDate: true,
          EndDate: true,
          StartTime: true,
          OrganisedBy: true,
        },
      });

      // Return the events in the response
      return c.json(events);
    } catch (error) {
      console.error("Unhandled error:", error);
      return c.json({ message: "Internal server error" }, 500);
    }
  });
  