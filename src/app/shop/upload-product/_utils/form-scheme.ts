import { z } from 'zod';
import { productInfoScheme } from '@/scripts/validation-schemes/product-upload/product-info-scheme';

export const formScheme = productInfoScheme.extend({
  category: z.string(),
  subcategory: z.string(),
});

export type TUploadProduct = z.infer<typeof formScheme>;
