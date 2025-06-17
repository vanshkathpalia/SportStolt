import { z } from "zod";

export const UserEditInput = z.object({
  image: z.string().url().optional(),
  bio: z.string().max(500).refine(val => val.trim().split(/\s+/).length <= 25, {
    message: "Bio must be 25 words or fewer"
  }),
  location: z.string().optional(),
  university: z.string().optional(),
  achievements: z.string().max(300).refine(val => val.trim().split(/\s+/).length <= 10, {
    message: "Achievements must be 10 words or fewer"
  }),
});
