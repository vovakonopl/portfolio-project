import { FC } from 'react';
import {
  getProductCardInfo,
  TProductCardInfo,
} from '@/lib/actions/product/get-product-card-info';
import { TProductWithVariants } from '@/types/product';
import Ratings from '@/components/product/ratings';
import Price from '@/components/product/price';
import Image from 'next/image';
import { cn } from '@/lib/cn';
import Link from 'next/link';

type TProductCardProps = (
  | {
      productId: string;
    }
  | TProductWithVariants
) & { className?: string };

const ProductCard: FC<TProductCardProps> = async ({ className, ...props }) => {
  let productCardInfo: TProductCardInfo | TProductWithVariants | null;
  if ('productId' in props) {
    productCardInfo = await getProductCardInfo(props.productId);

    if (!productCardInfo) {
      console.error(`Can not get '${props.productId}' for the card info.`);
      return <></>;
    }
  } else {
    productCardInfo = props;
  }

  const variants: string[] | null = productCardInfo.optionGroup
    ? [productCardInfo.optionName!]
    : null;

  if (variants) {
    for (const variant of productCardInfo.variants) {
      variants.push(variant.optionName);
    }
  }

  const URLToProduct: string = `/product/${productCardInfo.id}`;
  const createSearchParams = (variantName: string): URLSearchParams => {
    return new URLSearchParams(
      Object.fromEntries([[productCardInfo.optionGroup, variantName]]),
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
            src={`/api/image/${productCardInfo.imagePaths[0]}`}
            className="aspect-square w-full object-cover object-center"
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
          <h3 className="word-break font-medium">{productCardInfo.name}</h3>
        </Link>
        <Ratings
          className="gap-x-2"
          rating={productCardInfo.rating}
          ratingsCount={productCardInfo.ratingNumber}
          starClassName="size-4"
        />
        <Price
          className="text-base"
          discountPercent={productCardInfo.totalDiscountPercent}
          price={productCardInfo.priceInCents / 100}
        />

        {variants && (
          <div>
            <h4 className="text-sm font-medium">
              {productCardInfo?.optionGroup}
            </h4>
            <ul className="flex flex-wrap gap-1 text-xs">
              {variants.map((variantName) => (
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
