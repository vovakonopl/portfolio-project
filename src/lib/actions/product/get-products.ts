'use server';

import { PRODUCTS_COUNT_ON_PAGE } from '@/constants/products-count-on-page';
import db from '@/lib/db';
import { TProductsReturn } from '@/lib/actions/product/products-return-type';

export async function getProducts(
  page: number,
): Promise<TProductsReturn | null> {
  page = Math.max(page, 1);

  try {
    return {
      data: await db.product.findMany({
        include: { variants: true },
        orderBy: [{ rating: 'desc' }, { ratingNumber: 'desc' }],
        skip: (page - 1) * PRODUCTS_COUNT_ON_PAGE,
        take: PRODUCTS_COUNT_ON_PAGE,
      }),

      count: await db.product.count(),
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
