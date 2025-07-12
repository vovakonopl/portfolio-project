import { Prisma } from '@prisma/client';

export type TProduct = Prisma.ProductGetPayload<{
  include: {
    additionalServices: true;
    secondaryOptions: true;
    variants: true;
  };
}>;

export type TProductWithVariants = Prisma.ProductGetPayload<{
  include: {
    variants: true;
  };
}>;
