'use client';

import { FC, useMemo, useRef, useState } from 'react';
import {
  TUploadProduct,
  uploadProductScheme,
} from '@/scripts/validation-schemes/product-upload-scheme';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import ImageDropzone from '@/components/ui/dropzone';
import InputField from '@/components/ui/text-input-field';
import Error from '@/components/ui/error-message';
import { Category, SubCategory } from '@prisma/client';
import Title from './form-title';
import Select from '@/components/ui/select/select';
import SelectOption from '@/components/ui/select/select-option';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import { CircleHelp } from 'lucide-react';
import Tooltip from '@/components/ui/tooltip';

interface INewProductFormProps {
  categories: Array<Category>;
  subCategories: Map<string, Array<SubCategory>>;
}

const NewProductForm: FC<INewProductFormProps> = ({
  categories,
  subCategories,
}) => {
  const [isMultipleMode, setIsMultipleMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    getValues,
    setError,
  } = useForm<TUploadProduct>({
    resolver: zodResolver(uploadProductScheme),
  });

  const onSubmit = async () => {
    if (!formRef.current) return;

    const formData: FormData = new FormData(formRef.current);

    // add all images to formData manually
    // reason: FormData obj receives only 1 file from dropzone
    formData.delete('images');

    const images: Array<File> = getValues('images');
    images.forEach((image: File) => formData.append('images', image));

    // create new product
    const resp = await fetch('/api/product', {
      method: 'POST',
      body: formData,
    });

    // on error
    if (!resp.ok) {
      const error = await resp.text();
      setError('root', { message: error });

      return;
    }

    // redirect if success
    const productId = await resp.text();
    // router.replace(`/shop/product/${productId}`);
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      {/* single product or multiple variants mode*/}
      <div className="">
        <Title className="mb-2">
          Current mode
          <Tooltip
            className="inline text-sm"
            tooltipId="uploading-mode"
            tooltip={`Single product: just a single variant of the product.
              Multiple variants: you can upload several products within 1 page that differ in some options`}
          >
            <CircleHelp className="inline h-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Title>
        <ToggleSwitch
          id="product-mode"
          checked={isMultipleMode}
          toggle={setIsMultipleMode}
          uncheckedLabel="Signgle product"
          checkedLabel="Multiple variants"
        />
      </div>

      {/* categories */}
      <div className="">
        <Title className="mb-2">Where will you post your product?</Title>
        <div className="flex justify-center gap-4">
          <Controller
            control={control}
            name="category"
            render={({ field: { onChange, value } }) => (
              <Select
                fullWidth
                name="category"
                label="Category"
                onValueChange={onChange}
                value={value}
                containerClassName="min-w-80 max-w-lg"
              >
                <SelectOption id="1" value="1">
                  test1
                </SelectOption>
                <SelectOption id="2" value="2">
                  test2
                </SelectOption>
                <SelectOption id="3" value="3">
                  test3
                </SelectOption>
                <SelectOption id="4" value="4">
                  test4
                </SelectOption>
                <SelectOption id="5" value="5">
                  test5
                </SelectOption>
              </Select>
            )}
          />

          <Controller
            control={control}
            name="subcategory"
            render={({ field: { onChange, value } }) => (
              <Select
                fullWidth
                name="subcategory"
                label="Subcategory"
                onValueChange={onChange}
                value={value}
                containerClassName="min-w-80 max-w-lg"
              >
                <SelectOption id="1" value="1">
                  test1
                </SelectOption>
                <SelectOption id="2" value="2">
                  test2
                </SelectOption>
                <SelectOption id="3" value="3">
                  test3
                </SelectOption>
                <SelectOption id="4" value="4">
                  test4
                </SelectOption>
                <SelectOption id="5" value="5">
                  test5
                </SelectOption>
              </Select>
            )}
          />
        </div>
      </div>

      {/* product info*/}
      <div className="">
        {/* flex gap-2 max-sm:flex-col */}
        <Title>Product info</Title>
        <div className="">
          <div className="grid grid-cols-4 gap-2 max-md:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-0">
            <InputField
              id="name"
              register={register('name')}
              error={errors.name}
              type="text"
              label="Name"
              placeholder="My product"
              fullWidth
              containerProps={{
                className: 'col-span-3 max-md:col-span-2 max-sm:col-span-1',
              }}
            />

            <InputField
              id="price"
              register={register('price')}
              error={errors.price}
              type="number"
              label="Price"
              placeholder="1.00$"
              fullWidth
            />
          </div>
        </div>

        <Controller
          control={control}
          name="images"
          render={({ field: { onChange } }) => (
            <ImageDropzone
              onDrop={onChange}
              multiple
              errorMessage={errors.images?.message}
              id="images"
              name="images"
            />
          )}
        />

        <InputField
          id="description"
          register={register('description')}
          error={errors.description}
          component="textarea"
          label="Description"
          placeholder="About product"
          fullWidth
          className="h-36"
        />
      </div>

      {/* additional services */}

      <button
        disabled={isSubmitting}
        className="w-20 rounded border border-black px-1 py-2"
      >
        Submit
      </button>

      {errors.root && <Error>{errors.root.message}</Error>}
    </form>
  );
};

export default NewProductForm;
