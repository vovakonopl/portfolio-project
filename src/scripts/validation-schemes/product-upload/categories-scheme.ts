import { z } from 'zod';

export const categoriesByIdScheme = z.object({
  categoryId: z.string(),
  subCategoryId: z.string(),
});

export type TCategoriesById = z.infer<typeof categoriesByIdScheme>;
