import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { imageScheme } from '@/scripts/validation-schemes/image-scheme';
import { GROUPS } from '@/constants/product/groups';
import {
  refineMapKeys,
  createNameScheme,
} from '@/scripts/validation-schemes/product-upload/utils';

// Single object with product/variant info
export const productInfoScheme = z.object({
  name: z
    .string()
    .min(1, { message: 'Required.' })
    .max(PRODUCT_FIELDS_LIMITS.product.nameLength, {
      message: `Maximum length is ${PRODUCT_FIELDS_LIMITS.product.nameLength} chars.`,
    }),
  price: z.coerce
    .number({ message: 'Must be a number.' })
    .min(0.01, { message: 'Minimum price is 1 cent.' })
    .lte(PRODUCT_FIELDS_LIMITS.maxPrice, {
      message: `Maximum price is ${PRODUCT_FIELDS_LIMITS.maxPrice} dollars.`,
    }),
  description: z
    .string({ message: 'Must be a string.' })
    .max(PRODUCT_FIELDS_LIMITS.product.descriptionLength, {
      message: `Maximum ${PRODUCT_FIELDS_LIMITS.product.descriptionLength} characters.`,
    })
    .optional(),
  images: z.array(imageScheme).max(PRODUCT_FIELDS_LIMITS.product.imageCount, {
    message: `Maximum ${PRODUCT_FIELDS_LIMITS.product.imageCount} images.`,
  }),
});

// Map of objects with product/variant info
export const productInfoMapScheme = z
  .map(
    z.string({ message: 'Must be a string.' }),
    productInfoScheme.extend({
      optionName: createNameScheme(
        'option',
        PRODUCT_FIELDS_LIMITS.option.nameLength,
      ),
    }),
  )
  .refine((map) => map.size > 0, {
    message: 'At least 1 product variant is required.',
  })
  .refine((map) => map.size <= GROUPS.maxOptionCount, {
    message: `Maximum number of variants is ${GROUPS.maxOptionCount}.`,
  })
  .superRefine((map, ctx) => refineMapKeys(map, ctx, 'optionName'));

// export type TProductInfo = z.infer<typeof productInfoScheme>;

