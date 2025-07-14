'use server';

import { PRODUCTS_COUNT_ON_PAGE } from '@/constants/products-count-on-page';
import {
  fillProductNamesFromDb,
  productNames,
} from '@/lib/cache/product-names';
import {
  isFuzzyMatch,
  splitSearchQuery,
} from '@/scripts/fuzzy-search/fuzzy-match';
import db from '@/lib/db';
import { TProductsReturn } from '@/lib/actions/product/products-return-type';

export async function searchProducts(
  search: string,
  page: number,
): Promise<TProductsReturn | null> {
  if (splitSearchQuery(search).length === 0) return null;
  if (productNames.size === 0) {
    await fillProductNamesFromDb();
  }

  page = Math.max(page, 1);
  const resultIds: string[] = [];
  const skipCount: number = (page - 1) * PRODUCTS_COUNT_ON_PAGE;
  if (skipCount >= productNames.size) return null;

  let matchingCount: number = 0;
  for (const [id, names] of productNames.entries()) {
    for (const name of names) {
      if (isFuzzyMatch(search, name)) {
        matchingCount++;
        if (matchingCount > skipCount) {
          resultIds.push(id);
        }

        break;
      }
    }
  }

  try {
    return {
      data: await db.product.findMany({
        include: { variants: true },
        orderBy: [{ rating: 'desc' }, { ratingNumber: 'desc' }],
        where: {
          id: {
            in: resultIds,
          },
        },
      }),

      count: matchingCount,
    };
  } catch (e) {
    console.error(e);
    return null;
  }
}
