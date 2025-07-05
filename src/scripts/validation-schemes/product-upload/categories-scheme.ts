import { z } from 'zod';

export const categoriesScheme = z.object({
  category: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Category required.' }),
  subcategory: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Subcategory required.' }),
});

export type TCategories = z.infer<typeof categoriesScheme>;
