import { z } from 'zod';
import { MAX_OPTION_NAME_LENGTH } from '@/app/shop/upload-product/_utils/constants';

export const optionScheme = z.object({
  displayedName: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Required.' })
    .max(MAX_OPTION_NAME_LENGTH, {
      message: `Maximum length is ${MAX_OPTION_NAME_LENGTH} chars.`,
    }),
  name: z.optional(
    z
      .string({ message: 'Must be a string.' })
      .max(MAX_OPTION_NAME_LENGTH, { message: 'Maximum length is 25 chars.' }),
  ),
  price: z.union([
    z
      .number()
      .max(1000000, { message: 'Too expensive! Maximum 1 million.' })
      .min(0, { message: 'Must be 0 or greater.' }),
    z.undefined(),
  ]),
});

export type TOption = z.infer<typeof optionScheme>;
