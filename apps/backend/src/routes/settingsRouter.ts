import { Hono } from 'hono';
import { authMiddleware } from '../middleware/authMiddleware';
import { fetchPreferences, savePreferences } from '../controllers/settingsController';

export const settingsRouter = new Hono();

settingsRouter.use(authMiddleware); // attach userId to context

settingsRouter.get('/preferences', fetchPreferences);
settingsRouter.post('/preferences', savePreferences);
