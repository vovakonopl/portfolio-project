import { z } from 'zod';

const MAX_FILE_SIZE: number = 1024 * 1024 * 10; // 10 Mb
export const ACCEPTED_IMAGE_TYPES: Array<string> = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];
export const imageScheme = z
  .instanceof(File, { message: 'Must be a file.' })
  .refine(
    (image: File) => ACCEPTED_IMAGE_TYPES.includes(image.type),
    'Invalid file. Must be an image.',
  )
  .refine(
    (image: File) => image.size <= MAX_FILE_SIZE,
    'Maximum size is 10 Mb.',
  );
