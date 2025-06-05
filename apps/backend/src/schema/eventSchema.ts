import { z } from 'zod';

export const createEventInput = z.object({
  image: z.string().min(1, { message: 'Image URL is required' }),
  city: z.string().min(1, { message: 'City is necessary field'}),
  stadium: z.string().min(1, { message: 'Stadium name is required' }),
  startDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "startDate must be a valid date string",
  }),
  endDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "endDate must be a valid date string",
  }),
  startTime: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "startTime must be a valid datetime string",
  }),
});
