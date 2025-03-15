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

function formatDateToDDMMYYYY(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

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
              image: body.image,                      // Image URL
              city: body.city,                        // City 
              name: body.name,                        
              authorId: Number(userId),               // Authenticated user's ID
              stadium: body.stadium,                  // Stadium name
              StartDate: new Date(body.StartDate),    // Start date
              EndDate: new Date(body.EndDate),        // End date
              StartTime: new Date(body.StartTime),    // Start time
              OrganisedBy: body.OrganisedBy,          // Organizer name
              likeCount: 0,                           // Default value
              country: body.country || "",             // Country, default to empty string if not provided
              state: body.state || "",                 // State, default to empty string if not provided
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


// eventRouter.get('/bulk', async (c) => {
//     try {
//       // Ensure DATABASE_URL is set
//       if (!c.env.DATABASE_URL) {
//         return c.json({ message: "DATABASE_URL is not set" }, 500);
//       }
  
//       // Initialize PrismaClient with database URL
//       const prisma = new PrismaClient({
//         datasources: {
//           db: { url: c.env.DATABASE_URL },
//         },
//       });
  
//       // Fetch all events from the database
//       const events = await prisma.event.findMany({
//         select: {
//           id: true,
//           image: true,
//           city: true,
//           authorId: true,
//           stadium: true,
//           StartDate: true,
//           EndDate: true,
//           StartTime: true,
//           OrganisedBy: true,
//         },
//       });

//       // Return the events in the response
//       return c.json(events);
//     } catch (error) {
//       console.error("Unhandled error:", error);
//       return c.json({ message: "Internal server error" }, 500);
//     }
//   });

  eventRouter.get('/bulk', async (c) => {
    try {
      if (!c.env.DATABASE_URL) {
        return c.json({ message: "DATABASE_URL is not set" }, 500);
      }
  
      const prisma = new PrismaClient({
        datasources: {
          db: { url: c.env.DATABASE_URL },
        },
      });
  
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
  
      const transformedEvents = events.map((event) => ({
        id: event.id,
        author: {
          name: event.OrganisedBy || "Unknown Organizer",
          avatar: "https://via.placeholder.com/50", // Placeholder avatar
        },
        imageUrl: event.image,
        title: `${event.city} - ${event.stadium}`,
        content: `Starts: ${event.StartDate} at ${event.StartTime}, Ends: ${event.EndDate}`,
        likes: Math.floor(Math.random() * 100), // Mock likes
        sportTags: ["Live Event", event.city],
        comments: [],
        publishedDate: new Date().toISOString(),
      }));
  
      return c.json(transformedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
      return c.json({ message: "Failed to fetch events" }, 500);
    }
  });
  
  