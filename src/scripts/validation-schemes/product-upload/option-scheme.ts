import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { zodInvalidFileCharsRegexEntry } from '@/scripts/validation-schemes/invalid-file-chars-regex';
import { GROUPS } from '@/constants/product/groups';
import {
  createNameScheme,
  refineMapKeys,
} from '@/scripts/validation-schemes/product-upload/utils';

// Single option
export const optionScheme = z.object({
  displayedName: z
    .string({ message: 'Must be a string.' })
    .min(1, { message: 'Required.' })
    .max(PRODUCT_FIELDS_LIMITS.option.nameLength, {
      message: `Maximum length is ${PRODUCT_FIELDS_LIMITS.option.nameLength} chars.`,
    })
    .regex(...zodInvalidFileCharsRegexEntry),
  name: z.optional(
    z
      .string({ message: 'Must be a string.' })
      .max(PRODUCT_FIELDS_LIMITS.option.nameLength, {
        message: `Maximum length is ${PRODUCT_FIELDS_LIMITS.option.nameLength} chars.`,
      }),
  ),
  price: z.coerce
    .number()
    .min(0, { message: 'Must be 0 or greater.' })
    .max(PRODUCT_FIELDS_LIMITS.maxPrice, {
      message: `Maximum price is ${PRODUCT_FIELDS_LIMITS.maxPrice}.`,
    }),
});

export type TOption = z.infer<typeof optionScheme>;

// Map of options
export const optionMapScheme = z
  .map(
    createNameScheme('option', PRODUCT_FIELDS_LIMITS.option.nameLength),
    optionScheme,
  )
  .refine((map) => map.size <= GROUPS.maxOptionCount, {
    message: `Maximum number of options is ${GROUPS.maxOptionCount}.`,
  })
  .superRefine((map, ctx) => refineMapKeys(map, ctx, 'displayedName'));
