// // <reference types="@cloudflare/workers-types" />

// import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
// import { PrismaClient } from '@prisma/client/edge';
// import { withAccelerate } from '@prisma/extension-accelerate';

// export default {
//   async scheduled(
//     event: ScheduledEvent,
//     env: { DATABASE_URL: string },
//     ctx: ExecutionContext
//   ) {
//     const prisma = new PrismaClient({
//       datasourceUrl: env.DATABASE_URL
//     }).$extends(withAccelerate());

//     try {
//       const deletedStories = await prisma.story.deleteMany({
//         where: { endTime: { lt: new Date() } },
//       });

//       if (deletedStories.count > 0) {
//         console.log(`Deleted ${deletedStories.count} expired stories.`);
//       }
//     } catch (error) {
//       console.error('Cleanup error:', error);
//     }
//   }
// };
