import { z } from 'zod';

export const categoriesScheme = z.object({
  category: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Required.' })
    .refine((val) => val !== undefined, {
      message: 'Required.',
    }),
  subcategory: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Required.' })
    .refine((val) => val !== undefined, {
      message: 'Required.',
    }),
});

export type TCategories = z.infer<typeof categoriesScheme>;
