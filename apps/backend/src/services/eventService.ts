// // instread of using /lib/prisma use config prisma 
// // then don't have to const prisma = getPrisma(dbUrl);
// // src/services/eventService.ts
// import { getPrisma } from '../lib/prisma';

// export const createEvent = async (dbUrl: string, eventData: any, authorId: number) => {
//   const prisma = getPrisma(dbUrl);

//   const event = await prisma.event.create({
//     data: {
//       ...eventData,
//       authorId,
//       StartDate: new Date(eventData.StartDate),
//       EndDate: new Date(eventData.EndDate),
//       StartTime: new Date(eventData.StartTime),
//     },
//   });

//   return event;
// };
