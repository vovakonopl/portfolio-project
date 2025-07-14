'use client';

import { FC, useEffect } from 'react';
import { LOCAL_STORAGE_KEYS } from '@/constants/local-storage-keys';
import { storeTemporaryList } from '@/scripts/temporary-data';
import { RECENT_PRODUCTS } from '@/constants/temporary-data/recent-products';

interface IRecentTrackerProps {
  productId: string;
}

const RecentTracker: FC<IRecentTrackerProps> = ({ productId }) => {
  useEffect(() => {
    storeTemporaryList({
      filter: (id: string) => id !== productId,
      key: LOCAL_STORAGE_KEYS.recentlyVisited,
      maxCount: RECENT_PRODUCTS.maxCount,
      storeFor: RECENT_PRODUCTS.storingFor,
      value: productId,
    });
  }, [productId]);

  return null;
};

export default RecentTracker;
