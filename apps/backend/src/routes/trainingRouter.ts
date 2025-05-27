import { Hono } from 'hono';
import { authMiddleware } from '../middleware/authMiddleware';
import { fetchAndSendPlaylist } from '../controllers/trainingController';

export const trainingRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    YOUTUBE_API_KEY: string;
    YOUTUBE_CLIENT_ID: string;
    YOUTUBE_CLIENT_SECRET: string;
    YOUTUBE_REDIRECT_URI: string;
  };
  Variables: {
    userId: number;
  };
}>();

trainingRouter.use('*', authMiddleware);

trainingRouter.post('/fetch-playlist', fetchAndSendPlaylist);
