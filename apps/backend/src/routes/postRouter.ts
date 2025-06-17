import { Hono } from 'hono';
import { authMiddleware } from '../middleware/authMiddleware';
import { postController } from '~/controllers/postController';

export const postRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  },
  Variables: {
    userId: number;
  }
}>();

// Apply authMiddleware globally to all /post routes
postRouter.use('/*', authMiddleware);

// Routes
postRouter.post('/', postController.createPost);
postRouter.put('/', postController.updatePost);
postRouter.get('/bulk', postController.getbulkPosts);
postRouter.get('/:id', postController.getPostById);
postRouter.delete('/:id', postController.deletePost);
postRouter.post('/:id/like', postController.postLike);
postRouter.post('/:id/save', postController.postSave);
postRouter.get('/:id/status', postController.getPostStatus);

