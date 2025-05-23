import { z } from "zod";

export const signupInput = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  // role: z.enum(["INDIVIDUAL", "ORGANIZATION"]),
});

export const signinInput = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createPostInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const updatePostInput = z.object({
  title: z.string(),
  content: z.string(),
  id: z.number(),
});
