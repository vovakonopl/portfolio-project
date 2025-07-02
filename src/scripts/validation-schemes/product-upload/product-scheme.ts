import { z } from 'zod';
import { imageScheme } from '@/scripts/validation-schemes/image-scheme';

export const productScheme = z.object({});

export type TProduct = z.infer<typeof productScheme>;
