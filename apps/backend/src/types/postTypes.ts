import { Context } from 'hono';
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tagNames: z.array(z.string()).optional()
});

export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string()
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;

export type PostContext = Context<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    IMAGEKIT_PRIVATE_KEY: string;
    IMAGEKIT_PUBLIC_KEY: string;
    IMAGEKIT_URL_ENDPOINT: string;
  };
  Variables: {
    userId: number;
  };
}>;
