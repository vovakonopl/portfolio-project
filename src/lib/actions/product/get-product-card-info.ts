'use server';

import { Prisma } from '@prisma/client';
import db from '@/lib/db';

export type TProductCardInfo = Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    imagePaths: true;
    optionGroup: true;
    optionName: true;
    priceInCents: true;
    rating: true;
    ratingNumber: true;
    totalDiscountPercent: true;

    variants: {
      select: {
        optionName: true;
      };
    };
  };
}>;

export async function getProductCardInfo(
  productId: string,
): Promise<TProductCardInfo | null> {
  try {
    return await db.product.findUnique({
      where: {
        id: productId,
      },
      select: {
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
      },
    });
  } catch (e) {
    console.error(e);
    return null;
  }
}
