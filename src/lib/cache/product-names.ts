// Storage is required to perform a custom fuzzy search
import { TProductWithVariants } from '@/types/product';
import db from '@/lib/db';

// key - id, value - names of product variants
export const productNames: Map<string, string[]> = new Map();

export async function fillProductNamesFromDb() {
  const products: TProductWithVariants[] = await db.product.findMany({
    include: { variants: true },
  });

  productNames.clear();
  for (const product of products) {
    storeProductName(product);
  }
}

// Stores and updates the product names
export function storeProductName(product: TProductWithVariants) {
  const names: string[] = [product.name];

  for (const variant of product.variants) {
    names.push(variant.name);
  }

  productNames.set(product.id, names);
}

export function removeProductName(id: string) {
  productNames.delete(id);
}
