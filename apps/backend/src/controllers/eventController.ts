import { EventInterface, sendEventNotification } from "./notificationController";
import { createEventInput } from '../schema/eventSchema';
import { Context } from 'hono';
import { formatDateToDDMMYYYY } from '../utils/eventTime';
import { getPrisma } from '../lib/prismaClient';

// const getPrisma = (c: Context) =>
//   new PrismaClient({ datasources: { db: { url: c.env.DATABASE_URL } } });

// POST /api/v1/events/
// export const createEventHandler = async (c: Context) => {
//   try {
    
//     const body = await c.req.json();

//     console.log(body); // here uncommnent

//     const parseResult = createEventInput.safeParse(body);
//     if (!parseResult.success) {
//       c.status(400);
//       return c.json({
//         message: "Invalid input",
//         errors: parseResult.error.errors.map(err => ({
//           path: err.path.join('.'),
//           message: err.message
//         })),
//       });
//     }

//     const now = new Date();

//     const startDateTime = new Date(`${body.startDate}T${body.startTime}`);
//     const endDate = new Date(body.endDate);

//     if (startDateTime < now) {
//     return c.json({ message: "Start time must be in the future" }, 400);
//     }

//     if (endDate < new Date(body.startDate)) {
//     return c.json({ message: "End date must be after start date" }, 400);
//     }

//     const userId = c.get("userId");
//     if (!userId) {
//       c.status(403);
//       return c.json({ message: "User not authenticated" });
//     }

//     // const prisma = new PrismaClient({
//     //   datasources: {
//     //     db: { url: c.env.DATABASE_URL },
//     //   },
//     // });

//     // const prisma = getPrisma(c);

//     const prisma = getPrisma(c.env.DATABASE_URL);

//     // const event = await createEvent(c.env.DATABASE_URL, body, Number(userId)); 
//     // if using services

//     const event = await prisma.event.create({
//       data: {
//         ...body,
//         authorId: Number(userId),
//         startDate: new Date(body.startDate),
//         endDate: new Date(body.endDate),
//         startTime: new Date(body.startTime),
//       },
//     });

//     // return c.json({
//     //   id: event.id,
//     //   authorId: event.authorId,
//     //   startDate: formatDateToDDMMYYYY(new Date(event.startDate)),
//     //   endDate: formatDateToDDMMYYYY(new Date(event.endDate)),
//     //   startTime: event.startTime.toISOString(), // or formatted if needed
//     // });

//     return c.json({ id: event.id, authorId: event.authorId });
//   } catch (error) {
//     c.status(500);
//     return c.json({ message: "Internal server error" });
//   }
// };


export const createEventHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const parseResult = createEventInput.safeParse(body);
    if (!parseResult.success) {
      c.status(400);
      return c.json({
        message: "Invalid input",
        errors: parseResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        })),
      });
    }

    const now = new Date();
    const startDateTime = new Date(`${body.startDate}T${body.startTime}`);
    const endDate = new Date(body.endDate);

    if (startDateTime < now) {
      return c.json({ message: "Start time must be in the future" }, 400);
    }

    if (endDate < new Date(body.startDate)) {
      return c.json({ message: "End date must be after start date" }, 400);
    }

    const userId = c.get("userId");
    if (!userId) {
      c.status(403);
      return c.json({ message: "User not authenticated" });
    }

    const prisma = getPrisma(c.env.DATABASE_URL);

    const event = await prisma.event.create({
      data: {
        ...body,
        authorId: Number(userId),
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        startTime: new Date(body.startTime),
      },
    });

    // use the notification helper
    await sendEventNotification(prisma, event as EventInterface, Number(userId));

    return c.json({ id: event.id, authorId: event.authorId });
  } catch (error) {
    console.error(error);
    c.status(500);
    return c.json({ message: "Internal server error" });
  }
};

// GET api/v1/event/bulk 
export const getBulkEventsHandler = async (c: Context) => {
  try {
  const prisma = getPrisma(c.env.DATABASE_URL);

    const events = await prisma.event.findMany({
      where: {
        isArchived: false,
      },
      select: {
        id: true,
        image: true,
        name: true,
        country: true,
        state: true,
        city: true,
        authorId: true,
        stadium: true,
        startDate: true,
        endDate: true,
        startTime: true,
        OrganisedBy: true,
        registration: true,
      },
      orderBy: [ {startDate: 'asc'}, {endDate: 'asc'}, {startTime: 'asc'}], 
    });

    const transformedEvents = events.map((event) => {
      const startDate = formatDateToDDMMYYYY(new Date(event.startDate));
      const endDate = formatDateToDDMMYYYY(new Date(event.endDate));
      const startTime = new Date(event.startTime).toLocaleTimeString('en-GB', {
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
        organisedBy: event.OrganisedBy,
        city: event.city,
        registrationCount: event.registration.length,
        location: `${event.city} - ${event.stadium}`,
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
};

// POST /:id/register
export const registerUserHandler = async (c: Context) => {
  try {
    const eventId = Number(c.req.param('id'));
    const userId = c.get("userId");

    const prisma = getPrisma(c.env.DATABASE_URL);

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
};

// GET /:id/registrations
export const getRegistrationsHandler = async (c: Context) => {
  try {
    const eventId = Number(c.req.param('id'));
    const prisma = getPrisma(c.env.DATABASE_URL);

    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: true },
    });

    return c.json(registrations);
  } catch (error) {
    console.error("Fetch registrations error:", error);
    return c.json({ message: "Failed to fetch registrations" }, 500);
  }
};

// DELETE /:id
export const deleteEventHandler = async (c: Context) => {
  try {
    const eventId = Number(c.req.param('id'));
    const userId = c.get("userId");
    const prisma = getPrisma(c.env.DATABASE_URL);

    const event = await prisma.event.findUnique({ where: { id: eventId, isArchived: false }});

    if (!event) {
      c.status(404);
      return c.json({ message: "Event not found" });
    }

    if (event.authorId !== userId) {
      c.status(403);
      return c.json({ message: "Unauthorized" });
    }

    await prisma.event.delete({ where: { id: eventId } });

    return c.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return c.json({ message: "Failed to delete event" }, 500);
  }
};



// import { Hono } from 'hono'
// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
// import { verify } from 'hono/jwt'
// // import { createstoryInput, updatestoryInput } from '@vanshkathpalia/sportstolt-common'
// import { date, string, z } from "zod"
// import { authMiddleware } from '~/middleware/authMiddleware'
// import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport'

// export const eventRouter = new Hono<{
//     Bindings: {
//         DATABASE_URL: string;
//         JWT_SECRET: string;
//       } 
//     Variables: {
//         userId: number;
//     }
// }>();


// const createEventInput = z.object({
//     image: z.string().min(1, { message: 'Image URL is required' }), // Image URL must be non-empty
//     city: z.string().min(1, { message: 'City is necessary field'}),
//     stadium: z.string().min(1, { message: 'Stadium name is required' }), // Stadium name must be non-empty
//     startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
//       message: "startDate must be a valid date string",
//     }),
//     endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
//       message: "endDate must be a valid date string",
//     }),
//     startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
//       message: "startTime must be a valid datetime string",
//     }),
//     // startDate: z.string().datetime({ message: 'startDate must be a valid ISO datetime' }), // ISO datetime string
//     // endDate: z.string().datetime({ message: 'endDate must be a valid ISO datetime' }), // ISO datetime string
//     // startTime: z.string().datetime({ message: 'startTime must be a valid ISO datetime' }), // ISO datetime string
//   });

// function formatDateToDDMMYYYY(dateString: string): string {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// }

// // authenticate all routes
// eventRouter.use('/*', authMiddleware);


// // POST / (create event)
// eventRouter.post('/', async (c) => {
//   try {
//     const body = await c.req.json();
//     console.log("Received event body:", JSON.stringify(body, null, 2));

//     const parseResult = createEventInput.safeParse(body);
//     if (!parseResult.success) {
//       console.error("Validation Errors:", parseResult.error.errors);
//       c.status(400);
//       return c.json({
//         message: "Invalid input",
//         errors: parseResult.error.errors.map(err => ({
//           path: err.path.join('.'),
//           message: err.message
//         })),
//       });
//     }

//     const userId = c.get("userId");
//     if (!userId) {
//       c.status(403);
//       return c.json({ message: "User not authenticated" });
//     }

//     if (!c.env.DATABASE_URL) {
//       c.status(500);
//       return c.json({ message: "DATABASE_URL is not set" });
//     }

//     const prisma = new PrismaClient({
//       datasources: {
//         db: { url: c.env.DATABASE_URL },
//       },
//     });

//     // Use publishedDate sent from frontend or assign current date if none provided
//     const publishedDate = body.publishedDate
//       ? new Date(body.publishedDate)
//       : new Date();

//     const startDate = new Date(body.startDate);
//     const endDate = new Date(body.endDate);
//     const startTime = new Date(body.startTime);

//     console.log(`publishedDate: ${publishedDate.toISOString()}`);
//     console.log(`startDate: ${startDate.toISOString()}`);
//     console.log(`endDate: ${endDate.toISOString()}`);
//     console.log(`startTime: ${startTime.toISOString()}`);

//     if (startDate < publishedDate || endDate < publishedDate) {
//       c.status(400);
//       return c.json({ message: "Event start and end dates must be after the published date." });
//     }

//     if (startDate > endDate) {
//       c.status(400);
//       return c.json({ message: "Start date must be before or equal to end date." });
//     }

//     if (startTime < startDate) {
//       c.status(400);
//       return c.json({ message: "Start time cannot be before the start date." });
//     }

//     const event = await prisma.event.create({
//       data: {
//         image: body.image,
//         city: body.city,
//         name: body.name,
//         authorId: Number(userId),
//         stadium: body.stadium,
//         startDate: startDate,
//         endDate: endDate,
//         startTime: startTime,
//         OrganisedBy: body.OrganisedBy,
//         likeCount: 0,
//         country: body.country || "",
//         state: body.state || "",
//       },
//     });

//     console.log("Event created successfully:", event);

//     return c.json({ id: event.id, authorId: event.authorId });
//   } catch (error) {
//     console.error("Unhandled error:", error);
//     c.status(500);
//     return c.json({ message: "Internal server error" });
//   }
// });


// // GET /bulk (fetch events)
// eventRouter.get('/bulk', async (c) => {
//   try {
//     if (!c.env.DATABASE_URL) {
//       return c.json({ message: "DATABASE_URL is not set" }, 500);
//     }

//     const prisma = new PrismaClient({
//       datasources: {
//         db: { url: c.env.DATABASE_URL },
//       },
//     });

//     const events = await prisma.event.findMany({
//       select: {
//         id: true,
//         image: true,
//         name: true,
//         country: true,
//         state: true,
//         city: true,
//         authorId: true,
//         stadium: true,
//         startDate: true,
//         endDate: true,
//         startTime: true,
//         OrganisedBy: true,
//         registration: true,
//       },
//       orderBy: {
//         startDate: 'asc', // Order by start date ascending
//       },
//     });

//     const transformedEvents = events.map((event) => {
//       const startDate = new Date(event.startDate).toLocaleDateString('en-GB', {
//         day: '2-digit', month: 'long', year: 'numeric',
//       });

//       const endDate = new Date(event.endDate).toLocaleDateString('en-GB', {
//         day: '2-digit', month: 'long', year: 'numeric',
//       });

//       const startTime = new Date(event.startDate).toLocaleTimeString('en-GB', {
//         hour: '2-digit', minute: '2-digit', hour12: true,
//       });

//       return {
//         id: event.id,
//         author: {
//           name: event.OrganisedBy || "Unknown Organizer",
//           avatar: "https://via.placeholder.com/50",
//         },
//         imageUrl: event.image,
//         name: event.name,
//         state: event.state,
//         country: event.country,
//         startDate,
//         startTime,
//         endDate,
//         // endDate: event.endDate,
//         organisedBy: event.OrganisedBy,
//         city: event.city,
//         registrationCount: event.registration.length,
//         location: `${event.city} - ${event.stadium}`,
//         // startTime: `Starts: ${startDate} at ${startTime}`,
//         stadium: event.stadium,
//         timing: `Starts: ${startDate} at ${startTime}, Ends: ${endDate}`,
//         likes: Math.floor(Math.random() * 100),
//         sportTags: ["Live Event", event.city],
//         comments: [],
//         publishedDate: new Date().toISOString(),
//       };
//     });

//     return c.json(transformedEvents);
//   } catch (error) {
//     console.error("Error fetching events:", error);
//     return c.json({ message: "Failed to fetch events" }, 500);
//   }
// });

// // POST /:id/register for an event
// eventRouter.post('/:id/register', async (c) => {
//   try {
//     const eventId = Number(c.req.param('id'));
//     const userId = c.get("userId");

//     const prisma = new PrismaClient({
//       datasources: {
//         db: { url: c.env.DATABASE_URL },
//       },
//     });

//     const alreadyRegistered = await prisma.registration.findUnique({
//       where: {
//         userId_eventId: {
//           userId,
//           eventId,
//         },
//       },
//     });

//     if (alreadyRegistered) {
//       return c.json({ message: "Already registered for this event" }, 400);
//     }

//     const registration = await prisma.registration.create({
//       data: {
//         userId,
//         eventId,
//       },
//     });

//     return c.json({ message: "Successfully registered", registration });
//   } catch (error) {
//     console.error("Registration error:", error);
//     return c.json({ message: "Failed to register" }, 500);
//   }
// });

// // GET (fetch registrations for an event)
// eventRouter.get('/:id/registrations', async (c) => {
//   const eventId = Number(c.req.param('id'));
//   const prisma = new PrismaClient({
//     datasources: {
//       db: { url: c.env.DATABASE_URL },
//     },
//   });

//   const registrations = await prisma.registration.findMany({
//     where: { eventId },
//     include: { user: true }, // Assuming you want user info
//   });

//   return c.json(registrations);
// });


// eventRouter.delete('/:id', async (c) => {
//   try {
//     const eventId = Number(c.req.param('id'));
//     const userId = c.get("userId");

//     if (!c.env.DATABASE_URL) {
//       return c.json({ message: "DATABASE_URL is not set" }, 500);
//     }

//     const prisma = new PrismaClient({
//       datasources: {
//         db: { url: c.env.DATABASE_URL },
//       },
//     });

//     // Check if the event exists and belongs to the user
//     const event = await prisma.event.findUnique({
//       where: { id: eventId },
//     });

//     if (!event) {
//       c.status(404);
//       return c.json({ message: "Event not found" });
//     }

//     if (event.authorId !== userId) {
//       c.status(403);
//       return c.json({ message: "You are not authorized to delete this event" });
//     }

//     await prisma.event.delete({
//       where: { id: eventId },
//     });

//     return c.json({ message: "Event deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting event:", error);
//     return c.json({ message: "Failed to delete event" }, 500);
//   }
// });
  
  
  

// // eventRouter.get('/bulk', async (c) => {
// //     try {
// //       // Ensure DATABASE_URL is set
// //       if (!c.env.DATABASE_URL) {
// //         return c.json({ message: "DATABASE_URL is not set" }, 500);
// //       }
  
// //       // Initialize PrismaClient with database URL
// //       const prisma = new PrismaClient({
// //         datasources: {
// //           db: { url: c.env.DATABASE_URL },
// //         },
// //       });
  
// //       // Fetch all events from the database
// //       const events = await prisma.event.findMany({
// //         select: {
// //           id: true,
// //           image: true,
// //           city: true,
// //           authorId: true,
// //           stadium: true,
// //           startDate: true,
// //           endDate: true,
// //           startTime: true,
// //           OrganisedBy: true,
// //         },
// //       });

// //       // Return the events in the response
// //       return c.json(events);
// //     } catch (error) {
// //       console.error("Unhandled error:", error);
// //       return c.json({ message: "Internal server error" }, 500);
// //     }
// //   });
