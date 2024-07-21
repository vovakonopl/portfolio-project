'use client';

import { FC, useEffect, useState } from 'react';
import Filters from './_components/filters';
import Link from 'next/link';
import { useResize } from '@/scripts/hooks/useResize';

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
      <nav className="mb-4 flex gap-3 text-gray-400">
        <Link href="/">Home</Link>
        <span>&gt;</span>
        <Link href="/shop" className="text-black underline underline-offset-4">
          Shop
        </Link>
      </nav>
      <div className="flex gap-5">
        <aside className="sticky top-nav-h h-[calc(100dvh-var(--nav-height)-1rem)] w-72 rounded-2xl border border-gray-200 pb-4 pt-4 max-md:hidden">
          <Filters />
        </aside>
        <main className="h-[1000px] flex-1">
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
