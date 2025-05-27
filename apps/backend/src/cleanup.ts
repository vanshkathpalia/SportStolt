import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export default {
  async scheduled(
    event: ScheduledEvent,
    env: {
      DATABASE_URL: string;
    },
    ctx: ExecutionContext
  ) {

//     const prisma = new PrismaClient({
//       datasourceUrl: env.DATABASE_URL
//     }).$extends(withAccelerate());
//     diff form 
//     const prisma = new PrismaClient().$extends(withAccelerate());
//     this taking neon postgres env variable
    const prisma = new PrismaClient({
      datasourceUrl: env.DATABASE_URL
    }).$extends(withAccelerate());

    try {
      const now = new Date();
      const todayStr = now.toISOString().split("T")[0];

      const deletedStories = await prisma.story.deleteMany({
        where: { endTime: { lt: now } },
      });

      const deletedEvents = await prisma.event.deleteMany({
        where: {
          OR: [
            { EndDate: { lt: todayStr } },
            {
              EndDate: todayStr,
              StartTime: { lt: now.toISOString() },
            },
          ],
        },
      });

      if (deletedStories.count > 0) {
        console.log(`Deleted ${deletedStories.count} expired stories.`);
      }
      if (deletedEvents.count > 0) {
        console.log(`Deleted ${deletedEvents.count} expired events.`);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }
};