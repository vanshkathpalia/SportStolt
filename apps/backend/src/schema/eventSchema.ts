import { z } from 'zod';

export const createEventInput = z.object({
  image: z.string().min(1, { message: 'Image URL is required' }),
  city: z.string().min(1, { message: 'City is necessary field'}),
  stadium: z.string().min(1, { message: 'Stadium name is required' }),
  StartDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "StartDate must be a valid date string",
  }),
  EndDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "EndDate must be a valid date string",
  }),
  StartTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "StartTime must be a valid datetime string",
  }),
});
