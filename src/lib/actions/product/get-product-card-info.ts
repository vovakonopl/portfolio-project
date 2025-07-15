'use server';

import { Prisma } from '@prisma/client';
import db from '@/lib/db';

const select = Object.freeze({
  id: true,
  name: true,
  imagePaths: true,
  optionGroup: true,
  optionName: true,
  priceInCents: true,
  rating: true,
  ratingNumber: true,
  totalDiscountPercent: true,

  variants: {
    select: {
      optionName: true,
    },
  },
});

export type TProductCardInfo = Prisma.ProductGetPayload<{
  select: typeof select;
}>;

export async function getProductCardInfo(
  productId: string,
): Promise<TProductCardInfo | null> {
  try {
    return await db.product.findUnique({
      where: {
        id: productId,
      },
      select,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getProductCardInfoList(
  productIds: string[],
): Promise<TProductCardInfo[] | null> {
  try {
    return await db.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
      select,
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}
