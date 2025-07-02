import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';

export const optionScheme = z.object({
  displayedName: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Required.' })
    .max(PRODUCT_FIELDS_LIMITS.option.nameLength, {
      message: `Maximum length is ${PRODUCT_FIELDS_LIMITS.option.nameLength} chars.`,
    }),
  name: z.optional(
    z
      .string({ message: 'Must be a string.' })
      .max(PRODUCT_FIELDS_LIMITS.option.nameLength, {
        message: `Maximum length is ${PRODUCT_FIELDS_LIMITS.option.nameLength} chars.`,
      }),
  ),
  price: z.union([
    z
      .number()
      .min(0, { message: 'Must be 0 or greater.' })
      .max(PRODUCT_FIELDS_LIMITS.maxPrice, {
        message: `Maximum price is ${PRODUCT_FIELDS_LIMITS.maxPrice}.`,
      }),
    z.undefined(),
  ]),
});

export type TOption = z.infer<typeof optionScheme>;
