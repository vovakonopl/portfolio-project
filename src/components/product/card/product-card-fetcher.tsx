import { FC } from 'react';
import ProductCard from '@/components/product/card/product-card';
import {
  getProductCardInfo,
  TProductCardInfo,
} from '@/lib/actions/product/get-product-card-info';

interface IProductCardFetcherProps {
  className?: string;
  imageClassName?: string;
  productId: string;
}

const ProductCardFetcher: FC<IProductCardFetcherProps> = async ({
  productId,
  ...props
}) => {
  const productCardInfo: TProductCardInfo | null =
    await getProductCardInfo(productId);
  if (!productCardInfo) {
    console.warn(`Can not get '${productId}' for the card info.`);
    return null;
  }

  return <ProductCard {...productCardInfo} {...props} />;
};

export default ProductCardFetcher;
