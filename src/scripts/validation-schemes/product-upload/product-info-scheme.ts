import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { imageScheme } from '@/scripts/validation-schemes/image-scheme';

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

export type TProductInfo = z.infer<typeof productInfoScheme>;
