'use client';

// import Radio from '@/components/util-components/radio-input';
import {
  categoriesByIdScheme,
  TCategoriesById,
} from '@/scripts/validation-schemes/product-upload/categories-scheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, SubCategory } from '@prisma/client';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface IFirstStepProps {
  categories: Array<Category>;
  subCategories: Map<string, Array<SubCategory>>;
}

const FirstStep: FC<IFirstStepProps> = ({ categories, subCategories }) => {
  const [relevantSubcategories, setRelevantSubcategories] = useState<
    Array<SubCategory>
  >([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    resetField,
  } = useForm<TCategoriesById>({
    resolver: zodResolver(categoriesByIdScheme),
  });

  const selectedCategoryId = watch('categoryId');

  useEffect(() => {
    // reset subcategory field after changing category
    resetField('subCategoryId');

    if (!selectedCategoryId) return;

    const relevantSubcategories: Array<SubCategory> | undefined =
      subCategories.get(selectedCategoryId);

    // relevantSubcategories can not be undefined, but for type guard check it
    if (!relevantSubcategories) return;

    setRelevantSubcategories(relevantSubcategories);
  }, [selectedCategoryId, subCategories, resetField]);

  // console.log(getValues('category'));

  return (
    <div className="text-center">
      <h2 className="text-xl font-medium">Step 1</h2>
      <h3 className="text-lg font-medium">
        Select where your product should be posted
      </h3>

      <form>
        <div>
          <h4>Category</h4>
          <div className="grid grid-cols-4 gap-4 max-md:grid-cols-3 max-sm:grid-cols-2">
            {/*{categories.map((category: Category) => (*/}
            {/*  <Radio*/}
            {/*    id={category.name}*/}
            {/*    // containerProps={{ className: 'justify-center' }}*/}
            {/*    label={category.name}*/}
            {/*    value={category.id}*/}
            {/*    register={register('categoryId')}*/}
            {/*    key={category.name}*/}
            {/*  />*/}
            {/*))}*/}
          </div>
        </div>
        <div>
          <h4>Subcategory</h4>
          <div>
            {/*{relevantSubcategories.map((subCategory: SubCategory) => (*/}
            {/*  <Radio*/}
            {/*    id={subCategory.name}*/}
            {/*    label={subCategory.name}*/}
            {/*    value={subCategory.id}*/}
            {/*    register={register('subCategoryId')}*/}
            {/*    key={subCategory.name}*/}
            {/*  />*/}
            {/*))}*/}
          </div>
        </div>
      </form>
    </div>
  );
};

export default FirstStep;
