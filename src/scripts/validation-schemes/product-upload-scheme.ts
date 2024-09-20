import { z } from 'zod';

const MAX_FILE_SIZE: number = 1024 * 1024 * 10; // 10 Mb
export const ACCEPTED_IMAGE_TYPES: Array<string> = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

const imageScheme = z
  .instanceof(File, { message: 'Must be a file.' })
  .refine(
    (image: File) => ACCEPTED_IMAGE_TYPES.includes(image.type),
    'Invalid file. Must be an image.',
  )
  .refine(
    (image: File) => image.size <= MAX_FILE_SIZE,
    'Maximum size is 10 Mb.',
  );

export const uploadProductScheme = z.object({
  name: z
    .string({ message: 'Must be a string.' })
    .min(4, 'Minimum 4 characters.')
    .max(200, 'Maximum 200 characters.'),
  price: z.coerce
    .number({ message: 'Must be a number.' })
    .positive('Must be greater than 0.')
    .lte(1000000, 'The price is too high.'), // 1 mill dollars limit
  description: z
    .string({ message: 'Must be a string.' })
    .max(1000, 'Maximum 1000 characters.')
    .optional(),
  images: z
    .array(imageScheme)
    .min(1, 'Required.')
    .max(15, 'Maximum 15 images.'),
  category: z.string(),
  subcategory: z.string(),
});

export type TUploadProduct = z.infer<typeof uploadProductScheme>;
