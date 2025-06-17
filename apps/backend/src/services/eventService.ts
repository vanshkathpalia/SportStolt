import { getPrisma } from '../lib/prismaClient';
import { EventInterface } from '../controllers/notificationController';
import { sendEventNotification } from '../controllers/notificationController';
import { formatDateToDDMMYYYY } from '../utils/eventTime';

export const createEvent = async (dbUrl: string, body: any, userId: number) => {
  const prisma = getPrisma(dbUrl);
  
  const event = await prisma.event.create({
    data: {
      ...body,
      authorId: userId,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
      startTime: new Date(body.startTime),
    },
  });

  await sendEventNotification(prisma, event as EventInterface, userId);

  return event;
};

export const getBulkEvents = async (dbUrl: string) => {
  const prisma = getPrisma(dbUrl);
  const events = await prisma.event.findMany({
    where: { isArchived: false },
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
    orderBy: [
      { startDate: 'asc' },
      { endDate: 'asc' },
      { startTime: 'asc' },
    ],
  });

  return events.map((event) => {
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
};

export const registerUser = async (dbUrl: string, userId: number, eventId: number) => {
  const prisma = getPrisma(dbUrl);

  const alreadyRegistered = await prisma.registration.findUnique({
    where: { userId_eventId: { userId, eventId } },
  });

  if (alreadyRegistered) {
    throw new Error("Already registered");
  }

  return prisma.registration.create({
    data: { userId, eventId },
  });
};

export const getRegistrations = async (dbUrl: string, eventId: number) => {
  const prisma = getPrisma(dbUrl);
  return prisma.registration.findMany({
    where: { eventId },
    include: { user: true },
  });
};

export const deleteEvent = async (dbUrl: string, eventId: number, userId: number) => {
  const prisma = getPrisma(dbUrl);

  const event = await prisma.event.findUnique({
    where: { id: eventId, isArchived: false },
  });

  if (!event) throw new Error("Event not found");
  if (event.authorId !== userId) throw new Error("Unauthorized");

  await prisma.event.delete({ where: { id: eventId } });
  return { message: "Event deleted successfully" };
};
