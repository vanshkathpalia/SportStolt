import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import dotenv from 'dotenv';
import { getPrismaCleanup } from '~/lib/prismaCleanupClient';

dotenv.config();

import type { AcceleratedPrismaClient } from '~/lib/prismaClient';

export async function handleNotificationCron(
  event: ScheduledEvent,
  env: { DATABASE_URL: string; DIRECT_DATABASE_URL?: string },
  ctx: ExecutionContext
) {
  const DATABASE_URL =
    process.env.NODE_ENV === 'development'
      ? env.DIRECT_DATABASE_URL ?? process.env.DIRECT_DATABASE_URL ?? ''
      : env.DATABASE_URL ?? process.env.DATABASE_URL ?? '';

  if (!DATABASE_URL) {
    console.error('DATABASE_URL is missing');
    return;
  }

  
  const prisma = getPrismaCleanup(DATABASE_URL);
  const now = new Date();
// export async function handleNotificationCron(
//   event: ScheduledEvent,
//   env: { DATABASE_URL: string; DIRECT_DATABASE_URL?: string },
//   ctx: ExecutionContext
// ) {
//   const DATABASE_URL =
//     process.env.NODE_ENV === 'development'
//       ? env.DIRECT_DATABASE_URL ?? process.env.DIRECT_DATABASE_URL ?? ''
//       : env.DATABASE_URL ?? process.env.DATABASE_URL ?? '';

//   if (!DATABASE_URL) {
//     console.error('DATABASE_URL is missing');
//     return;
//   }

//   const prisma = getPrisma(DATABASE_URL) as unknown as PrismaClient;
//   const now = new Date();

  try {
    // Archive expired stories
    const archivedStories = await prisma.story.updateMany({
      where: { endTime: { lt: now }, isArchived: false },
      data: { isArchived: true, archivedAt: now },
    });

    // Archive expired events
    const todayStart = new Date(now.toISOString().split('T')[0]); // 2025-06-05T00:00:00.000Z
    const archivedEvents = await prisma.event.updateMany({
      where: {
        isArchived: false,
        OR: [
          { endDate: { lt: todayStart } },
          { endDate: todayStart, startTime: { lt: now.toISOString() } },
        ],
      },
      data: { isArchived: true, archivedAt: now },
    });

    // Notify users for story verification
    const attendances = await prisma.storyAttendance.findMany({
      where: { story: { activityEnded: { lte: now } } },
      include: {
        story: {
          select: {
            activityEnded: true,
            endTime: true,
            stadium: true,
            location: true,
          },
        },
      },
    });

    for (const attendance of attendances) {
      const alreadyNotified = await prisma.notification.findFirst({
        where: {
          receiverId: attendance.userId,
          storyImageId: attendance.storyImageId,
          type: 'VERIFICATION',
        },
      });

      if (!alreadyNotified) {
        await prisma.notification.create({
          data: {
            type: 'VERIFICATION',
            receiverId: attendance.userId,
            message: `You have gone to this activity at ${attendance.story.stadium}.\nWas the story valid or not?`,
            storyImageId: attendance.storyImageId,
            seen: false,
            scheduledAt: attendance.story.activityEnded,
          },
        });
      }
    }

    console.log(
      `Cron Complete: Archived ${archivedStories.count} stories, ${archivedEvents.count} events, and scheduled ${attendances.length} notifications.`
    );
  } catch (err) {
    console.error('Cron error:', err);
  } finally {
    await prisma.$disconnect();
  }
}

export function startDevCleanupLoop() {
  if (process.env.NODE_ENV === 'development') {
    const DATABASE_URL = process.env.DIRECT_DATABASE_URL ?? '';

    if (!DATABASE_URL) {
      console.warn('DIRECT_DATABASE_URL not set for dev cron');
    } else {
      setInterval(() => {
        console.log('Simulating cron in dev...');
        handleNotificationCron(
          {} as ScheduledEvent,
          { DATABASE_URL, DIRECT_DATABASE_URL: DATABASE_URL },
          {} as ExecutionContext
        );
      }, 5 * 60 * 1000); // Every 5 minutes
    }
  }
}

// Original Cron
// import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
// import { PrismaClient } from '@prisma/client/edge';
// import { withAccelerate } from '@prisma/extension-accelerate';
// import dotenv from 'dotenv';
// import { AcceleratedPrismaClient, getPrisma } from '~/lib/prismaClient';

// dotenv.config();

// const createPrismaClient = (url: string) => {
//   return process.env.NODE_ENV === 'development'
//     ? new PrismaClient({ datasourceUrl: url })
//     : new PrismaClient({ datasourceUrl: url }).$extends(withAccelerate());
// };

// export async function handleNotificationCron(
//   event: ScheduledEvent,
//   env: { DATABASE_URL: string; DIRECT_DATABASE_URL?: string },
//   ctx: ExecutionContext
// ) {
//   const DATABASE_URL =
//     process.env.NODE_ENV === 'development'
//       ? env.DIRECT_DATABASE_URL ?? process.env.DIRECT_DATABASE_URL ?? ''
//       : env.DATABASE_URL ?? '';

//   if (!DATABASE_URL) {
//     console.error('❌ DATABASE_URL is missing');
//     return;
//   }

//   const prisma: AcceleratedPrismaClient = getPrisma(DATABASE_URL);
//   const now = new Date();

//   try {
//     const archivedStories = await prisma.story.updateMany({
//       where: { endTime: { lt: now }, isArchived: false },
//       data: { isArchived: true, archivedAt: now },
//     });

//     const todayStr = now.toISOString().split('T')[0];
//     const archivedEvents = await prisma.event.updateMany({
//       where: {
//         isArchived: false,
//         OR: [
//           { endDate: { lt: todayStr } },
//           { endDate: todayStr, startTime: { lt: now.toISOString() } },
//         ],
//       },
//       data: { isArchived: true, archivedAt: now },
//     });

//     const attendances = await prisma.storyAttendance.findMany({
//       where: { story: { activityEnded: { lte: now } } },
//       include: {
//         story: {
//           select: {
//             activityEnded: true,
//             endTime: true,
//             stadium: true,
//             location: true,
//           },
//         },
//       },
//     });

//     for (const attendance of attendances) {
//       const alreadyNotified = await prisma.notification.findFirst({
//         where: {
//           receiverId: attendance.userId,
//           storyImageId: attendance.storyImageId,
//           type: 'VERIFICATION',
//         },
//       });

//       if (!alreadyNotified) {
//         await prisma.notification.create({
//           data: {
//             type: 'VERIFICATION',
//             receiverId: attendance.userId,
//             message: `You have gone to this activity at ${attendance.story.stadium}. Was the story valid or not?`,
//             storyImageId: attendance.storyImageId,
//             seen: false,
//             scheduledAt: attendance.story.activityEnded,
//           },
//         });
//       }
//     }

//     console.log(
//       `Cron Done: Archived ${archivedStories.count} stories, ${archivedEvents.count} events, and scheduled ${attendances.length} notifications.`
//     );
//   } catch (err) {
//     console.error('Cron error:', err);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// // DEV ONLY CLEANUP TASK
// let cleanupInterval: NodeJS.Timeout | null = null;

// export function startDevCleanupLoop() {
//   if (process.env.NODE_ENV !== 'development') return;

//   const prisma = new PrismaClient({
//     datasourceUrl: process.env.DIRECT_DATABASE_URL,
//   }).$extends(withAccelerate());

//   const cleanup = async () => {
//     try {
//       const deleted = await prisma.story.deleteMany({
//         where: { endTime: { lt: new Date() } },
//       });
//       if (deleted.count > 0) {
//         console.log(`Deleted ${deleted.count} expired stories.`);
//       }
//     } catch (err) {
//       console.error('Cleanup error:', err);
//     }
//   };

//   cleanupInterval = setInterval(cleanup, 10 * 60 * 1000); // every 10 mins
//   console.log('🧼 Cleanup loop started');
// }
