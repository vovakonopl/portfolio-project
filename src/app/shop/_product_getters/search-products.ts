'use server';

import { TProductReturn } from '@/app/shop/_product_getters/return-type';

export async function searchProducts(
  search: string,
  page: number,
): Promise<TProductReturn | null> {
  page = Math.max(page, 1);

  return null;
}
