import { FC } from 'react';
import CurrentRoutePath from '@/components/current-route-path';
import { SEARCH_PARAMETER_KEY } from '@/constants/search-parameter-key';
import { TProductsReturn } from '@/lib/actions/product/products-return-type';
import { getProducts } from '@/lib/actions/product/get-products';
import { searchProducts } from '@/lib/actions/product/search-products';
import ProductCard from '@/components/product/card/product-card';
import { cn } from '@/lib/cn';

export const dynamic = 'force-dynamic'; // Retrieve actual data on each request

type TSearchParams = { [key: string]: string | string[] | undefined };

interface IShopProps {
  searchParams: Promise<TSearchParams>;
}

const Shop: FC<IShopProps> = async ({ searchParams }) => {
  const search = (await searchParams)[SEARCH_PARAMETER_KEY];

  let products: TProductsReturn | null;
  if (!search) {
    products = await getProducts(1);
  } else {
    // join search query into 1 string if there are multiple
    const searchQuery: string = Array.isArray(search)
      ? search.join(' ')
      : search;

    products = await searchProducts(searchQuery, 1);
  }

  return (
    <div className="container flex flex-col">
      <CurrentRoutePath />

      <div className="flex gap-5">
        {/*<Filters />*/}

        <main className="flex-1">
          {!products ||
            (products.data.length === 0 && (
              <p className="text-center text-2xl text-gray-400">
                No products found
              </p>
            ))}

          {products && (
            <ul
              className={cn(
                'grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-4 max-lg:gap-2',
              )}
            >
              {products.data.map((product) => (
                <li className="h-full" key={product.id}>
                  <ProductCard {...product} className="h-full" />
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
