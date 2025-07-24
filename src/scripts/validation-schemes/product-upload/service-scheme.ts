import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { imageScheme } from '@/scripts/validation-schemes/image-scheme';
import { MAX_SERVICES } from '@/constants/product/services';
import {
  createNameScheme,
  refineMapKeys,
} from '@/scripts/validation-schemes/product-upload/utils';

// Single service
export const serviceScheme = z.object({
  name: z
    .string()
    .min(1, { message: 'Required.' })
    .max(PRODUCT_FIELDS_LIMITS.service.nameLength, {
      message: `Maximum length is ${PRODUCT_FIELDS_LIMITS.service.nameLength} chars.`,
    }),
  price: z.coerce
    .number({ message: 'Must be a number.' })
    .min(0.01, { message: 'Minimum price is 1 cent.' })
    .lte(PRODUCT_FIELDS_LIMITS.maxPrice, {
      message: 'Maximum price is 1 million dollars.',
    }),
  description: z
    .string({ message: 'Must be a string.' })
    .max(PRODUCT_FIELDS_LIMITS.service.descriptionLength, {
      message: `Maximum ${PRODUCT_FIELDS_LIMITS.service.descriptionLength} characters.`,
    })
    .optional(),
  image: imageScheme.optional().nullable(),
});

export type TService = z.infer<typeof serviceScheme>;

// Map of services
export const serviceMapScheme = z
  .map(
    createNameScheme('service', PRODUCT_FIELDS_LIMITS.service.nameLength),
    serviceScheme,
  )
  .refine((map) => map.size <= MAX_SERVICES, {
    message: `Maximum number of services is ${MAX_SERVICES}.`,
  })
  .superRefine((map, ctx) => refineMapKeys(map, ctx, 'name'));
