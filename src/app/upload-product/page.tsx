import { FC } from 'react';
import db from '@/lib/db';
import { Category, SubCategory } from '@prisma/client';
import NewProductForm from './_components/form';

interface INewProductProps {}

const NewProduct: FC<INewProductProps> = async () => {
  const categories: Category[] = await db.category.findMany();
  const subCategories: SubCategory[] = await db.subCategory.findMany();

  // Map for categories
  // key: category ID; value: category
  const categoriesMap: Map<string, Category> = new Map(
    categories.map((category: Category) => [category.id, category]),
  );

  // Map for sub categories
  // key: category NAME; value: array of related subcategories
  const subCategoriesMap: Map<string, SubCategory[]> = new Map(
    categories.map((category: Category) => [category.name, []]),
  );

  // append subcategories to map
  for (const subCategory of subCategories) {
    const relatedCategory: Category | undefined = categoriesMap.get(
      subCategory.relatedCategoryId,
    );
    if (!relatedCategory) {
      console.error('Related category does not exist. Contact support.');
      continue;
    }

    const subCategories: SubCategory[] | undefined = subCategoriesMap.get(
      relatedCategory.name,
    )!;
    subCategories.push(subCategory);
  }

  return (
    <div className="container">
      <main className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-medium">Create a new product</h1>
        <NewProductForm
          categories={categories}
          subCategories={subCategoriesMap}
        />
      </main>
    </div>
  );
};

export default NewProduct;
