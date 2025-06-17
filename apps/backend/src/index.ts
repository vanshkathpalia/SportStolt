// src/index.ts

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
dotenv.config();

import type { ScheduledEvent, ExecutionContext } from '@cloudflare/workers-types';
import { handleNotificationCron, startDevCleanupLoop } from './cron/notifVerifyAndCleanup';

import { userRouter } from '~/controllers/user';
import { postRouter } from './controllers/post';
import { storyRouter } from '~/controllers/story';
import { apiPostRouter } from '~/controllers/apiPost';
import { eventRouter } from './routes/eventRouter';
import { searchRouter } from '~/controllers/search';
import { notificationRouter } from './routes/notificationRouter';
import { trainingRouter } from './routes/trainingRouter';
import { settingsRouter } from './routes/settingsRouter';
import { earnRouter } from './controllers/earn';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    DIRECT_DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'OPTIONS'],
}));

app.options('*', (c) => {
  c.status(204);
  return c.text('');
});

app.route('/api/v1/user', userRouter);
app.route('/api/v1/post', postRouter);
app.route('/api/v1/story', storyRouter);
app.route('/api/v1/apiPost', apiPostRouter);
app.route('/api/v1/event', eventRouter);
app.route('/api/v1/search', searchRouter);
app.route('/api/v1/notification', notificationRouter);
app.route('/api/v1/training', trainingRouter);
app.route('/api/v1/settings', settingsRouter);
app.route('/api/v1/earn', earnRouter);

// Dev-only cron simulation (no Cloudflare required)
if (process.env.NODE_ENV === 'development') {
  require('events').EventEmitter.defaultMaxListeners = 50;

  startDevCleanupLoop();

  setInterval(() => {
    console.log('Simulating cron job...');
    handleNotificationCron(
      {} as ScheduledEvent,
      {
        DATABASE_URL: process.env.DATABASE_URL || '',
        DIRECT_DATABASE_URL: process.env.DIRECT_DATABASE_URL,
      },
      {} as ExecutionContext
    );
  }, 5 * 60 * 1000); // every 5 mins
}

export default {
  fetch: app.fetch,
  scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    return handleNotificationCron(event, env, ctx);
  },
};
