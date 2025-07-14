'use client';

import { FC, useEffect, useState } from 'react';
import { z } from 'zod';
import { getTemporaryList } from '@/scripts/temporary-data';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import { RECENT_PRODUCTS } from '@/constants/temporary-data/recent-products';

const productIdsScheme = z.array(z.string());

interface IRecentlyViewedProductsProps {}

const RecentlyViewedProducts: FC<IRecentlyViewedProductsProps> = () => {
  const [productIds, setProductIds] = useState<string[] | null>(null);

  useEffect(() => {
    const data = getTemporaryList(
      LOCAL_STORAGE_KEYS.recentlyVisited,
      RECENT_PRODUCTS.storingFor,
    ).map((value) => value.data);

    const parsedData = productIdsScheme.safeParse(data);
    if (parsedData.success) {
      setProductIds(parsedData.data);
    }
  }, []);

  if (!productIds || productIds.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xl font-bold">Recently viewed products</h2>
      <ul className="flex gap-2">
        {/*{productIds.map((id) => (*/}
        {/*  <ProductCard productId={id} key={id} />*/}
        {/*))}*/}
      </ul>
    </section>
  );
};

export default RecentlyViewedProducts;
