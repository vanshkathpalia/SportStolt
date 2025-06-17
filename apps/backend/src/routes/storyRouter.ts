import { Hono } from 'hono';
import { authMiddleware } from '~/middleware/authMiddleware';
import { createStoryController, fetchStoriesController, getPointsController } from '~/controllers/storyController';

export const storyRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: number;
  };
}>();

storyRouter.use('/*', authMiddleware);

storyRouter.post('/', createStoryController);
storyRouter.get('/fetch', fetchStoriesController);
storyRouter.get('/points', getPointsController);
