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
//       startDate: new Date(eventData.startDate),
//       endDate: new Date(eventData.endDate),
//       startTime: new Date(eventData.startTime),
//     },
//   });

//   return event;
// };
