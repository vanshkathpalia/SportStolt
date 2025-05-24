import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'
// import { createstoryInput, updatestoryInput } from '@vanshkathpalia/sportstolt-common'
import { date, string, z } from "zod"
import { authMiddleware } from '~/middleware/authMiddleware'
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport'

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
    StartDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "StartDate must be a valid date string",
    }),
    EndDate: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "EndDate must be a valid date string",
    }),
    StartTime: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "StartTime must be a valid datetime string",
    }),
    // StartDate: z.string().datetime({ message: 'StartDate must be a valid ISO datetime' }), // ISO datetime string
    // EndDate: z.string().datetime({ message: 'EndDate must be a valid ISO datetime' }), // ISO datetime string
    // StartTime: z.string().datetime({ message: 'StartTime must be a valid ISO datetime' }), // ISO datetime string
  });

function formatDateToDDMMYYYY(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// authenticate all routes
eventRouter.use('/*', authMiddleware);


// POST / (create event)
eventRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    console.log("Received event body:", JSON.stringify(body, null, 2));

    const parseResult = createEventInput.safeParse(body);
    if (!parseResult.success) {
      console.error("Validation Errors:", parseResult.error.errors);
      c.status(400);
      return c.json({
        message: "Invalid input",
        errors: parseResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        })),
      });
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

    // Use publishedDate sent from frontend or assign current date if none provided
    const publishedDate = body.publishedDate
      ? new Date(body.publishedDate)
      : new Date();

    const startDate = new Date(body.StartDate);
    const endDate = new Date(body.EndDate);
    const startTime = new Date(body.StartTime);

    console.log(`publishedDate: ${publishedDate.toISOString()}`);
    console.log(`startDate: ${startDate.toISOString()}`);
    console.log(`endDate: ${endDate.toISOString()}`);
    console.log(`startTime: ${startTime.toISOString()}`);

    if (startDate < publishedDate || endDate < publishedDate) {
      c.status(400);
      return c.json({ message: "Event start and end dates must be after the published date." });
    }

    if (startDate > endDate) {
      c.status(400);
      return c.json({ message: "Start date must be before or equal to end date." });
    }

    if (startTime < startDate) {
      c.status(400);
      return c.json({ message: "Start time cannot be before the start date." });
    }

    const event = await prisma.event.create({
      data: {
        image: body.image,
        city: body.city,
        name: body.name,
        authorId: Number(userId),
        stadium: body.stadium,
        StartDate: startDate,
        EndDate: endDate,
        StartTime: startTime,
        OrganisedBy: body.OrganisedBy,
        likeCount: 0,
        country: body.country || "",
        state: body.state || "",
      },
    });

    console.log("Event created successfully:", event);

    return c.json({ id: event.id, authorId: event.authorId });
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
        registration: true,
      },
      orderBy: {
        StartDate: 'asc', // Order by start date ascending
      },
    });

    const transformedEvents = events.map((event) => {
      const startDate = new Date(event.StartDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      const endDate = new Date(event.EndDate).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'long', year: 'numeric',
      });

      const startTime = new Date(event.StartDate).toLocaleTimeString('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: true,
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
        startDate,
        startTime,
        endDate,
        // endDate: event.EndDate,
        organisedBy: event.OrganisedBy,
        city: event.city,
        registrationCount: event.registration.length,
        location: `${event.city} - ${event.stadium}`,
        // startTime: `Starts: ${startDate} at ${startTime}`,
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

// POST /:id/register for an event
eventRouter.post('/:id/register', async (c) => {
  try {
    const eventId = Number(c.req.param('id'));
    const userId = c.get("userId");

    const prisma = new PrismaClient({
      datasources: {
        db: { url: c.env.DATABASE_URL },
      },
    });

    const alreadyRegistered = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (alreadyRegistered) {
      return c.json({ message: "Already registered for this event" }, 400);
    }

    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
      },
    });

    return c.json({ message: "Successfully registered", registration });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ message: "Failed to register" }, 500);
  }
});

// GET (fetch registrations for an event)
eventRouter.get('/:id/registrations', async (c) => {
  const eventId = Number(c.req.param('id'));
  const prisma = new PrismaClient({
    datasources: {
      db: { url: c.env.DATABASE_URL },
    },
  });

  const registrations = await prisma.registration.findMany({
    where: { eventId },
    include: { user: true }, // Assuming you want user info
  });

  return c.json(registrations);
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
