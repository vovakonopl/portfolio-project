'use client';

import { FC, useEffect, useState } from 'react';
import { z } from 'zod';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import { RECENT_PRODUCTS } from '@/constants/temporary-data/recent-products';
import ProductCard from '@/components/product/card/product-card';
import {
  getProductCardInfoList,
  TProductCardInfo,
} from '@/lib/actions/product/get-product-card-info';
import { getTemporaryList } from '@/scripts/temporary-data';

const productIdsScheme = z.array(z.string());

interface IRecentlyViewedProductsProps {}

const RecentlyViewedProducts: FC<IRecentlyViewedProductsProps> = () => {
  const [productCardInfoList, setProductCardInfoList] = useState<
    TProductCardInfo[] | null
  >(null);
  const [isSorted, setIsSorted] = useState<boolean>(false);

  useEffect(() => {
    const data = getTemporaryList(
      LOCAL_STORAGE_KEYS.recentlyVisited,
      RECENT_PRODUCTS.storingFor,
    ).map((value) => value.data);

    let isAborted = false; // abort fetching on unmount
    const parsedData = productIdsScheme.safeParse(data);
    if (!parsedData.success) return;

    getProductCardInfoList(parsedData.data).then((cardInfoList) => {
      if (!isAborted) {
        setProductCardInfoList(cardInfoList);
      }
    });

    return () => {
      isAborted = true;
    };
  }, []);

  // sort received data to the same order as received from local storage
  useEffect(() => {
    if (!productCardInfoList || isSorted) return;

    // data is already sorted
    const data = getTemporaryList(
      LOCAL_STORAGE_KEYS.recentlyVisited,
      RECENT_PRODUCTS.storingFor,
    ).map((value) => value.data);
    const cardInfoMap = new Map(
      productCardInfoList.map((cardInfo) => [cardInfo.id, cardInfo]),
    );

    const cardInfoList = [];
    for (const id of data) {
      if (typeof id != 'string') return;

      const cardInfo = cardInfoMap.get(id);
      if (!cardInfo) return;

      cardInfoList.push(cardInfo);
    }

    setProductCardInfoList(cardInfoList);
    setIsSorted(true);
  }, [isSorted, productCardInfoList]);

  if (!productCardInfoList || productCardInfoList.length === 0 || !isSorted) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Recently viewed products</h2>
      <ul className="flex gap-2">
        {productCardInfoList.map((productCardInfo) => (
          <ProductCard
            {...productCardInfo}
            className="w-56"
            imageClassName="h-24"
            key={productCardInfo.id}
          />
        ))}
      </ul>
    </section>
  );
};

export default RecentlyViewedProducts;
