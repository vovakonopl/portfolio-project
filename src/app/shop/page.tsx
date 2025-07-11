'use client';

import { FC, useState } from 'react';
import { useResize } from '@/scripts/hooks/useResize';
import CurrentRoutePath from '@/components/current-route-path';
import Filters from './_components/filters';

interface IShopProps {}

const Shop: FC<IShopProps> = () => {
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  // hide filters on resize
  useResize(() => {
    // width after which filters are no longer visible
    const windowMaxWidth: number = 768;
    const windowWidth: number = window.innerWidth;

    if (windowWidth >= windowMaxWidth) {
      setIsFilterVisible(false);
    }
  });

  const closeFilters = () => {
    setIsFilterVisible(false);
  };

  return (
    <div className="container flex flex-col">
      <CurrentRoutePath />

      <div className="flex gap-5">
        <Filters />

        <main className="flex-1">
          <div className="hidden max-md:flex">
            {!isFilterVisible && (
              <button
                onClick={() => {
                  setIsFilterVisible(true);
                }}
              >
                filters
              </button>
            )}
            {isFilterVisible && (
              <>
                <div className="absolute inset-0 z-20 bg-black opacity-10"></div>
                <div className="absolute inset-0 top-14 z-20 rounded-t-[1.25rem] bg-white pt-4 md:hidden">
                  <Filters close={closeFilters} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
