import { FC } from 'react';
import { notFound } from 'next/navigation';
import { ProductVariant, SecondaryOption } from '@prisma/client';
import db from '@/lib/db';
import { cn } from '@/lib/cn';
import { TProduct } from '@/types/product';
import Image from 'next/image';
import ProductImages from '@/app/product/[productId]/_components/product-images';
import OptionGroup from '@/app/product/[productId]/_components/option-group';
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
          {/* TODO*/}
          <div className="h-6 bg-gray-200">{/* rating */}</div>

          {/* price */}
          <div className="decoration- flex gap-3 text-xl font-bold text-black">
            {product.totalDiscountProcent && (
              <span>
                ${(price * (1 - product.totalDiscountProcent)).toFixed(2)}
              </span>
            )}

            <span
              className={cn(
                product.totalDiscountProcent && 'text-gray-400 line-through',
              )}
            >
              ${price.toFixed(2)}
            </span>

            {product.totalDiscountProcent && (
              <span className="text rounded-full bg-rose-100 p-1 px-3 text-sm text-rose-600">
                {Math.floor(product.totalDiscountProcent)}%
              </span>
            )}
          </div>

          {/* options */}
          <hr className="border-gray-300" />
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
          <hr className="border-gray-300" />
          <p className="word-break">{mainVariant.description}</p>
        </div>
      </div>

      {/* comments */}
    </div>
  );
};

export default ProductPage;
