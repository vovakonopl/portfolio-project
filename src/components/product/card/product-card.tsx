import { FC } from 'react';
import { TProductWithVariants } from '@/types/product';
import Ratings from '@/components/product/ratings';
import Price from '@/components/product/price';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import Link from 'next/link';
import { TProductCardInfo } from '@/lib/actions/product/get-product-card-info';

type TProductCardProps = (TProductWithVariants | TProductCardInfo) & {
  className?: string;
  imageClassName?: string;
};

const ProductCard: FC<TProductCardProps> = ({
  className,
  id,
  imageClassName,
  imagePaths,
  optionGroup,
  optionName,
  name,
  priceInCents,
  rating,
  ratingNumber,
  totalDiscountPercent,
  variants,
}) => {
  const variantNames: string[] | null = optionGroup ? [optionName!] : null;

  for (const variant of variants) {
    variantNames?.push(variant.optionName);
  }

  const URLToProduct: string = `/product/${id}`;
  const createSearchParams = (variantName: string): URLSearchParams => {
    return new URLSearchParams(
      Object.fromEntries([[optionGroup, variantName]]),
    );
  };

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-lg shadow transition-all hover:shadow-lg',
        className,
      )}
    >
      <Link className="peer" href={URLToProduct}>
        <div className="w-full">
          <Image
            alt=""
            src={`/api/image/${imagePaths[0]}`}
            className={cn(
              'aspect-square w-full object-cover object-center',
              imageClassName,
            )}
            height={600}
            width={600}
          />
        </div>
      </Link>

      <div className="flex flex-col gap-1 p-2">
        <Link
          className="peer text-black hover:underline active:text-opacity-60"
          href={URLToProduct}
        >
          <h3 className="word-break font-medium">{name}</h3>
        </Link>
        <Ratings
          className="gap-x-2"
          rating={rating}
          ratingsCount={ratingNumber}
          starClassName="size-4"
        />
        <Price
          className="text-base"
          discountPercent={totalDiscountPercent}
          price={priceInCents / 100}
        />

        {variantNames && (
          <div>
            <h4 className="text-sm font-medium">{optionGroup}</h4>
            <ul className="flex flex-wrap gap-1 text-xs">
              {variantNames.map((variantName) => (
                <li
                  className={cn(
                    'rounded border border-gray-400 px-1 transition-colors',
                    'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
                  )}
                  key={variantName}
                >
                  <Link
                    href={`${URLToProduct}?${createSearchParams(variantName)}`}
                  >
                    {variantName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
