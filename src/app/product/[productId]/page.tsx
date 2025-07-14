import { FC } from 'react';
import { notFound } from 'next/navigation';
import { ProductVariant, SecondaryOption } from '@prisma/client';
import db from '@/lib/db';
import { TProduct } from '@/types/product';
import {
  TGroupsMap,
  TOptionsMap,
  TSearchParams,
  TSelectedOptions,
} from '@/app/product/[productId]/_utils/types';
import {
  createURLSearchParams,
  generatePriceAndName,
  getSelectedOptionsFromParams,
} from '@/app/product/[productId]/_utils/functions';
import Image from 'next/image';
import ProductImages from '@/app/product/[productId]/_components/product-images';
import OptionGroup from '@/app/product/[productId]/_components/option-group';
import Price from '@/components/product/price';
import Services from '@/app/product/[productId]/_components/services';
import { cn } from '@/lib/cn';
import Ratings from '@/components/product/ratings';

interface IProductPageProps {
  params: Promise<{ productId: string }>;
  searchParams: Promise<TSearchParams>;
}

const ProductPage: FC<IProductPageProps> = async ({ params, searchParams }) => {
  const { productId } = await params;
  const product: TProduct | null = await db.product.findUnique({
    where: { id: productId },
    include: {
      additionalServices: true,
      secondaryOptions: true,
      variants: true,
    },
  });
  if (!product) {
    notFound();
  }

  const groupsMap: TGroupsMap = new Map();
  // add main option group if it exists
  if (product.optionGroup) {
    const map: TOptionsMap = new Map([[product.optionName!, product]]);
    for (const variant of product.variants) {
      map.set(variant.optionName, variant);
    }

    groupsMap.set(product.optionGroup, map);
  }

  // add secondary option groups if there is any
  for (const option of product.secondaryOptions) {
    const map: TOptionsMap | undefined = groupsMap.get(option.optionGroup);
    if (!map) {
      const map: TOptionsMap = new Map([[option.optionName, option]]);
      groupsMap.set(option.optionGroup, map);

      continue;
    }

    map.set(option.optionName, option);
  }

  // get selected options from search params
  const selectedOptions: TSelectedOptions = getSelectedOptionsFromParams(
    await searchParams,
    groupsMap,
  );

  let mainVariant: TProduct | ProductVariant = product;
  if (product.optionGroup) {
    const mainGroup = groupsMap.get(product.optionGroup)!;
    const variantName: string = selectedOptions[product.optionGroup];
    mainVariant = mainGroup.get(variantName) as TProduct | ProductVariant;
  }

  const updateURL = (group: string, optionName: string) => {
    const selectedOption: TSelectedOptions = {};
    selectedOption[group] = optionName;

    return createURLSearchParams({
      groupsMap,
      newOptions: selectedOption,
      selectedOptions,
    });
  };

  // calculate name and price
  const selectedSecondaryOptions: SecondaryOption[] = [];
  for (const groupName in selectedOptions) {
    if (groupName === mainVariant.optionGroup) continue;

    const groupMap = groupsMap.get(groupName);
    if (!groupMap) continue;

    const option = groupMap.get(selectedOptions[groupName]) as SecondaryOption;
    if (option) {
      selectedSecondaryOptions.push(option);
    }
  }

  const { name, price } = generatePriceAndName(
    mainVariant,
    selectedSecondaryOptions,
  );

  return (
    <div className="container">
      {/* product */}
      <div className="flex gap-10 max-md:flex-col max-md:gap-5">
        {/* images */}
        <ProductImages>
          {mainVariant.imagePaths.map((imagePath: string, idx) => (
            <Image
              alt={`Image #${idx + 1}`}
              src={`/api/image/${imagePath}`}
              className="size-full object-contain"
              height={800}
              width={800}
              key={imagePath}
              priority={idx === 0}
            />
          ))}
        </ProductImages>

        {/* product info */}
        <div className="flex flex-1 flex-col gap-2">
          {/* name */}
          <h1 className="text-2xl font-medium">{name}</h1>

          {/* rating */}
          <Ratings
            rating={product.rating}
            ratingsCount={product.ratingNumber}
          />

          {/* price */}
          <Price price={price} discountPercent={product.totalDiscountPercent} />

          {/* options */}
          {Array.from(groupsMap.keys()).length > 0 && (
            <hr className="border-gray-300" />
          )}
          {Array.from(groupsMap.keys()).map((group: string) => (
            <OptionGroup
              activeOption={selectedOptions[group]}
              groupName={group}
              options={Array.from(groupsMap.get(group)!.values())}
              updateURL={(optionName: string) => updateURL(group, optionName)}
              key={group}
            />
          ))}

          {/* description */}
          {mainVariant.description && (
            <>
              <hr className="border-gray-300" />
              <p className="word-break">{mainVariant.description}</p>
            </>
          )}

          {/* services */}
          {product.additionalServices.length > 0 && (
            <Services services={product.additionalServices} />
          )}

          {/* add to cart button */}
          <button
            className={cn(
              'mx-auto w-full max-w-lg rounded-full bg-black px-4 py-2',
              'text-center text-white hover:opacity-85 active:opacity-75',
            )}
            // TODO: Add handler in future. To make it, button must be a client component
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* comments */}
    </div>
  );
};

export default ProductPage;
