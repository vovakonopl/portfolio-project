import { z } from 'zod';
import { imageScheme } from '@/scripts/validation-schemes/image-scheme';

export const serviceScheme = z.object({
  name: z
    .string()
    .min(1, { message: 'Required.' })
    .max(50, { message: 'Maximum length is 50 chars.' }),
  price: z.coerce
    .number({ message: 'Must be a number.' })
    .min(0.01, { message: 'Minimum price is 1 cent.' })
    .lte(1000000, { message: 'Maximum price is 1 million dollars.' }),
  description: z
    .string({ message: 'Must be a string.' })
    .max(500, { message: 'Maximum 500 characters.' })
    .optional(),
  image: imageScheme.optional(),
});

export type TService = z.infer<typeof serviceScheme>;
