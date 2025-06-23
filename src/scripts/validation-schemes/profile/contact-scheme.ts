import { z } from 'zod';

export const contactScheme = z.object({
  body: z
    .string({ message: 'Must be a string.' })
    .min(1, 'required.')
    .max(30, 'Maximum 30 characters.'),
  url: z
    .string({ message: 'Must be a string.' })
    .optional()
    .refine(
      (url: string | undefined) =>
        !url || url.startsWith('https://') || url.startsWith('http://'),
      'Invalid URL.',
    )
    .refine((url: string | undefined) => !url || url.length >= 9),
});

export type TContact = z.infer<typeof contactScheme>;
