import NewProductForm from './_components/form';
import db from '@/lib/db';
import { Category, SubCategory } from '@prisma/client';
import FirstStep from './_components/step1';
import { auth } from '@clerk/nextjs/server';

interface INewProductProps {}

const NewProduct = async () => {
  // const categories = await db.category.findMany();
  // const subCategories = await db.subCategory.findMany();
  const categories: Array<SubCategory> = [];
  const subCategories: Array<SubCategory> = [];

  // create Map with categories and with array of subcategories with a key as category id
  // Map with categories
  // const categoriesMap: Map<string, Category> = new Map(
  //   categories.map((category: Category) => [category.id, category]),
  // );

  // Map with empty arrays of subcategories
  const subCategoriesMap: Map<string, Array<SubCategory>> = new Map(
    categories.map((category: Category) => [category.id, []]),
  );
  // append subcategories to map's arrays
  subCategories.forEach((subCategory: SubCategory) => {
    // const subCategories: Array<SubCategory> | undefined = subCategoriesMap.get(
    //   subCategory.relatedCategoryId,
    // );

    if (!subCategories) {
      console
        .error
        // `Category with id: ${subCategory.relatedCategoryId} does not exist.`,
        ();
      return;
    }

    subCategories.push(subCategory);
  });

  // console.log(subCategoriesMap, categories);

  return (
    <div className="container">
      <main className="flex flex-col items-center">
        <h1 className="mb-2 text-2xl font-medium">Create a new product</h1>
        {/* <FirstStep categories={categories} subCategories={subCategoriesMap} /> */}
        <NewProductForm
          categories={categories}
          subCategories={subCategoriesMap}
        />
      </main>
    </div>
  );
};

export default NewProduct;
