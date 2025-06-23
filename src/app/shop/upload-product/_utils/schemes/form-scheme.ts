import { z } from 'zod';
import { productScheme } from '@/scripts/validation-schemes/product-upload/product-scheme';

export const formScheme = productScheme.extend({
  category: z.string(),
  subcategory: z.string(),
});

export type TUploadProduct = z.infer<typeof formScheme>;
