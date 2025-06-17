import { Hono } from "hono";
import { userController } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    GEOLOCATION_API_KEY: string;
    FRONTEND_BASE_URL: string;
  }
}>();

userRouter.post('/signup', userController.signup);
userRouter.post('/signin', userController.signin);
userRouter.get('/users', userController.getAllUsers);
userRouter.get('/me', authMiddleware, userController.getCurrentUser);
userRouter.get('/:id/profile', authMiddleware, userController.getProfile);
userRouter.patch('/:id/profile', authMiddleware, userController.updateProfile);
userRouter.get('/:id/posts', authMiddleware, userController.getUserPosts);
userRouter.get('/:id/events', authMiddleware, userController.getUserEvents);
userRouter.get('/id/:username', userController.getUserIdByUsername);
