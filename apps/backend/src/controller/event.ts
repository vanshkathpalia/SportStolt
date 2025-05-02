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
// POST / (create event)
eventRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    console.log(body);

    const { success } = createEventInput.safeParse(body);
    if (!success) {
      c.status(411);
      return c.json({ message: "Invalid input" });
    }

    const userId = c.get("userId");
    if (!userId) {
      c.status(403);
      return c.json({ message: "User not authenticated" });
    }

    if (!c.env.DATABASE_URL) {
      c.status(500);
      return c.json({ message: "DATABASE_URL is not set" });
    }

    const prisma = new PrismaClient({
      datasources: {
        db: { url: c.env.DATABASE_URL },
      },
    });

    const event = await prisma.event.create({
      data: {
        image: body.image,
        city: body.city,
        name: body.name,
        authorId: Number(userId),
        stadium: body.stadium,
        StartDate: new Date(body.StartDate),
        EndDate: new Date(body.EndDate),
        StartTime: new Date(body.StartTime),
        OrganisedBy: body.OrganisedBy,
        likeCount: 0,
        country: body.country || "",
        state: body.state || "",
      },
    });

    return c.json({ id: event.id });
  } catch (error) {
    console.error("Unhandled error:", error);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
});


// GET /bulk (fetch events)
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
        name: true,
        country: true,
        state: true,
        city: true,
        authorId: true,
        stadium: true,
        StartDate: true,
        EndDate: true,
        StartTime: true,
        OrganisedBy: true,
      },
    });

    const transformedEvents = events.map((event) => {
      const startDate = new Date(event.StartDate).toLocaleDateString('en-GB');
      const endDate = new Date(event.EndDate).toLocaleDateString('en-GB');
      const startTime = new Date(event.StartTime).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return {
        id: event.id,
        author: {
          name: event.OrganisedBy || "Unknown Organizer",
          avatar: "https://via.placeholder.com/50",
        },
        imageUrl: event.image,
        name: event.name,
        state: event.state,
        country: event.country,
        city: event.city,
        location: `${event.city} - ${event.stadium}`,
        startTime: `Starts: ${startDate} at ${startTime}`,
        stadium: event.stadium,
        timing: `Starts: ${startDate} at ${startTime}, Ends: ${endDate}`,
        likes: Math.floor(Math.random() * 100),
        sportTags: ["Live Event", event.city],
        comments: [],
        publishedDate: new Date().toISOString(),
      };
    });

    return c.json(transformedEvents);
  } catch (error) {
    console.error("Error fetching events:", error);
    return c.json({ message: "Failed to fetch events" }, 500);
  }
});


  eventRouter.delete('/:id', async (c) => {
    try {
      const eventId = Number(c.req.param('id'));
      const userId = c.get("userId");
  
      if (!c.env.DATABASE_URL) {
        return c.json({ message: "DATABASE_URL is not set" }, 500);
      }
  
      const prisma = new PrismaClient({
        datasources: {
          db: { url: c.env.DATABASE_URL },
        },
      });
  
      // Check if the event exists and belongs to the user
      const event = await prisma.event.findUnique({
        where: { id: eventId },
      });
  
      if (!event) {
        c.status(404);
        return c.json({ message: "Event not found" });
      }
  
      if (event.authorId !== userId) {
        c.status(403);
        return c.json({ message: "You are not authorized to delete this event" });
      }
  
      await prisma.event.delete({
        where: { id: eventId },
      });
  
      return c.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error("Error deleting event:", error);
      return c.json({ message: "Failed to delete event" }, 500);
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
