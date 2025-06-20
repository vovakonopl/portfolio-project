import { z } from 'zod';
import { imageScheme } from '@/scripts/validation-schemes/image-scheme';

export const productScheme = z.object({
  name: z
    .string()
    .min(1, { message: 'Required.' })
    .max(200, { message: 'Maximum length is 200 chars.' }),
  price: z.coerce
    .number({ message: 'Must be a number.' })
    .min(0.01, { message: 'Minimum price is 1 cent.' })
    .lte(1000000, { message: 'Maximum price is 1 million dollars.' }),
  description: z
    .string({ message: 'Must be a string.' })
    .max(1000, { message: 'Maximum 1000 characters.' })
    .optional(),
  images: z.array(imageScheme).max(15, { message: 'Maximum 15 images.' }),
});

export type TProduct = z.infer<typeof productScheme>;
