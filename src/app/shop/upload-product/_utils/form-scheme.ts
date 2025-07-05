import { z } from 'zod';
import { categoriesScheme } from '@/scripts/validation-schemes/product-upload/categories-scheme';
import { productInfoScheme } from '@/scripts/validation-schemes/product-upload/product-info-scheme';

export const formScheme = productInfoScheme.extend(categoriesScheme.shape);

export type TUploadProduct = z.infer<typeof formScheme>;
