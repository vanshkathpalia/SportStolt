// require('events').EventEmitter.defaultMaxListeners = 50; // Set the number of listeners based on your needs
// in case of dev. environment

if (process.env.NODE_ENV === 'development') {
  require('events').EventEmitter.defaultMaxListeners = 50;
  console.log("EventEmitter defaultMaxListeners set to 50 in development mode");
}
// in case of production environment

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { apiPostRouter } from '~/controllers/apiPost';
import { eventRouter } from '~/controllers/event';
import { notificationRouter } from '~/controllers/notification';
import { postRouter } from '~/controllers/post';
import { searchRouter } from '~/controllers/search';
import { storyRouter } from '~/controllers/story';
import { userRouter } from '~/controllers/user';
// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate'
import { trainingRouter } from '~/controllers/mailer';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use('/*', cors())
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("api/v1/story", storyRouter);
app.route("api/v1/apiPost", apiPostRouter);
app.route("api/v1/event", eventRouter);
app.route("api/v1/search", searchRouter);
app.route("/api/v1/notificaiton", notificationRouter);
app.route("/api/v1/training", trainingRouter)

// let cleanupInterval: NodeJS.Timeout | null = null; //what is the use of this ?

// const cleanupExpiredStories = async () => {
//   const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

//   try {
//     const deletedStories = await prisma.story.deleteMany({
//       where: { endTime: { lt: new Date() } },
//     });

//     if (deletedStories.count > 0) {
//       console.log(`Deleted ${deletedStories.count} expired stories.`);
//     }
//   } catch (error) {
//     console.error("Error deleting expired stories:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// };

// // Start the interval when the server starts
// const startCleanupInterval = () => {
//   if (cleanupInterval === null) {
//     cleanupInterval = setInterval(cleanupExpiredStories, 60 * 1000); // Run every minute
//   }
// };

// // Stop the interval when the server shuts down
// const stopCleanupInterval = () => {
//   if (cleanupInterval !== null) {
//     clearInterval(cleanupInterval);
//     cleanupInterval = null;
//   }
// };

// startCleanupInterval();

// // You can also call `stopCleanupInterval()` at server shutdown to clear the interval

export default app
