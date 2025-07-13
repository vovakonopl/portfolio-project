import { FC } from 'react';
import CurrentRoutePath from '@/components/current-route-path';
import { SEARCH_PARAMETER_KEY } from '@/constants/search-parameter-key';
import { TProductReturn } from '@/app/shop/_product_getters/return-type';
import { getProducts } from '@/app/shop/_product_getters/get-products';
import { searchProducts } from '@/app/shop/_product_getters/search-products';
import Filters from './_components/filters';

export const dynamic = 'force-dynamic'; // Retrieve actual data on each request

type TSearchParams = { [key: string]: string | string[] | undefined };

interface IShopProps {
  searchParams: Promise<TSearchParams>;
}

const Shop: FC<IShopProps> = async ({ searchParams }) => {
  const search = (await searchParams)[SEARCH_PARAMETER_KEY];

  let products: TProductReturn | null;
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
        <Filters />

        <main className="flex-1">
          {!products ||
            (products.data.length === 0 && (
              <p className="text-lg text-gray-500">No products found</p>
            ))}

          {products &&
            products.data.map((product) => (
              <div
                className="mb-2 flex flex-col rounded border border-gray-400"
                key={product.id}
              >
                <p>{product.name}</p>
                {product.variants.map((variant) => (
                  <p key={variant.id}>{variant.name}</p>
                ))}
              </div>
            ))}
        </main>
      </div>
    </div>
  );
};

export default Shop;
