

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate';
import dotenv from 'dotenv';

import { apiPostRouter } from '~/controllers/apiPost';

// import { eventRouter } from '~/controllers/event.controller';
import { eventRouter } from '~/routes/eventRouter'
import { trainingRouter } from './routes/trainingRouter';


import { notificationRouter } from '~/controllers/notification';
import { postRouter } from '~/controllers/post';
import { searchRouter } from '~/controllers/search';
import { storyRouter } from '~/controllers/story';
import { userRouter } from '~/controllers/user';
import { settingsRouter } from './routes/settingsRouter';

// import { PrismaClient } from '@prisma/client/edge'
// import { withAccelerate } from '@prisma/extension-accelerate';
// src/index.ts

dotenv.config();

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

app.use('*', cors({
  origin: '*', // or restrict to your domain -> with vercel deployed domail 
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
  }), async (c, next) => {
    if (c.req.method === 'OPTIONS') {
      return new Response(null, { status: 204 }); 
    }
    await next();
  }
);

app.options('*', (c) => {
  c.status(204); // Respond to preflight requests
  return c.text(''); // Return an empty response

  // Alternatively, you can return a Response object directly
  // return new Response(null, { status: 204 });

  // return c.text('ok', { status: 204 }); -> error...
  // (text: "ok", status?: ContentfulStatusCode | undefined, headers?: HeaderRecord | undefined): 
});

app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("/api/v1/story", storyRouter);
app.route("/api/v1/apiPost", apiPostRouter);
app.route("/api/v1/event", eventRouter);
app.route("/api/v1/search", searchRouter);
app.route("/api/v1/notificaiton", notificationRouter);
app.route("/api/v1/training", trainingRouter)
app.route("/api/v1/settings", settingsRouter);

export default app




let cleanupInterval: NodeJS.Timeout | null = null;

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
}).$extends(withAccelerate());

const cleanupExpiredStories = async () => {
  try {
    const deletedStories = await prisma.story.deleteMany({
      where: { endTime: { lt: new Date() } },
    });

    if (deletedStories.count > 0) {
      console.log(`Deleted ${deletedStories.count} expired stories.`);
    }
  } catch (error) {
    console.error("Error deleting expired stories:", error);
  }
};

const startCleanupInterval = () => {
  if (cleanupInterval === null) {
    cleanupInterval = setInterval(cleanupExpiredStories, 10 * 60 * 1000); // Every 10 mins
  }
};

const stopCleanupInterval = () => {
  if (cleanupInterval !== null) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};

// call it below the delete logic
if (process.env.NODE_ENV === 'development') {
  require('events').EventEmitter.defaultMaxListeners = 50;
  console.log("EventEmitter defaultMaxListeners set to 50 in development mode");

  startCleanupInterval();
}

// // require('events').EventEmitter.defaultMaxListeners = 50; // Set the number of listeners based on your needs
// // in case of dev. environment

// if (process.env.NODE_ENV === 'development') {
//   require('events').EventEmitter.defaultMaxListeners = 50;
//   console.log("EventEmitter defaultMaxListeners set to 50 in development mode");
// }
