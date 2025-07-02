'use client';

import { FC, useCallback, useEffect, useReducer, useRef } from 'react';
import { Category, SubCategory } from '@prisma/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import ImageDropzone from '@/components/ui/dropzone';
import InputField from '@/components/ui/text-input-field';
import Error from '@/components/ui/error-message';
import Select from '@/components/ui/select/select';
import SelectOption from '@/components/ui/select/select-option';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import Tooltip from '@/components/ui/tooltip';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { IFormState } from '@/types/product/form-state-interface';
import { Product } from '@/types/product/product';
import { TMainGroup, TOptionGroups } from '@/types/product/option-groups';
import { TServiceMap } from '@/types/product/additional-service';
import { productInfoScheme } from '@/scripts/validation-schemes/product-upload/product-info-scheme';
import { CircleHelp } from 'lucide-react';
import { formReducer, FormStateActions } from '../_reducers/form-reducer';
import {
  productReducer,
  ProductStateActions,
} from '../_reducers/product-reducer';
import { secondaryGroupsReducer } from '../_reducers/option-groups/secondary-groups-reducer';
import {
  MainGroupActions,
  mainOptionGroupReducer,
} from '../_reducers/option-groups/main-group-reducer';
import { serviceReducer } from '../_reducers/service-reducer';
import { formScheme, TUploadProduct } from '../_utils/form-scheme';
import Title from './form-title';
import Groups from './groups';
import ServicesList from './additional-services/services-list';

const initialMainGroupValue: Readonly<TMainGroup> = {
  name: 'Main group',
  options: new Map([['Option1', new Product({ optionName: 'Option1' })]]),
};

const initialFormState: IFormState = {
  isMultipleMode: false,
  variants: initialMainGroupValue,
  secondaryOptions: new Map(),
  additionalServices: new Map(),
};

interface INewProductFormProps {
  categories: Array<Category>;
  subCategories: Map<string, Array<SubCategory>>;
}

const NewProductForm: FC<INewProductFormProps> = ({
  categories,
  subCategories,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [secondaryGroups, dispatchSecondaryGroups] = useReducer(
    secondaryGroupsReducer,
    new Map() as TOptionGroups,
  );
  const [mainGroup, dispatchMainGroup] = useReducer(
    mainOptionGroupReducer,
    initialMainGroupValue,
  );
  const [activeProduct, dispatchActiveProduct] = useReducer(
    productReducer,
    new Product({ optionName: 'Option1' }),
  );
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState,
  );
  const [additionalServices, dispatchAdditionalServices] = useReducer(
    serviceReducer,
    new Map() as TServiceMap,
  );
  const mainGroupPrevState = useRef<Readonly<TMainGroup> | null>(null);
  const {
    control,
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    watch,
  } = useForm<TUploadProduct>({
    resolver: zodResolver(formScheme),
  });

  // update product state on value change
  useEffect(() => {
    const { unsubscribe } = watch((value, { name }) => {
      if (!name) return unsubscribe;

      if (name in new Product()) {
        dispatchActiveProduct({
          type: ProductStateActions.SetField,
          payload: {
            field: name as keyof Product,
            value: value[name as keyof typeof value] as Product[keyof Product],
          },
        });
      }
    });

    return unsubscribe;
  }, [watch]);

  // clear errors for product fields on change.
  useEffect(() => {
    const { unsubscribe } = watch((_, { name }) => {
      if (!name || !(name in new Product())) return unsubscribe;
      if (errors[name as keyof TUploadProduct]) {
        clearErrors(name);
      }
    });

    return unsubscribe;
  }, [clearErrors, errors, watch]);

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

  // Update form state when other parts are updated
  useEffect(() => {
    dispatchMainGroup({
      type: MainGroupActions.UpdateOption,
      payload: { option: activeProduct },
    });
  }, [activeProduct]);

  useEffect(() => {
    dispatchFormState({
      type: FormStateActions.SetField,
      payload: {
        key: 'variants',
        value: mainGroup,
      },
    });
  }, [mainGroup]);

  useEffect(() => {
    dispatchFormState({
      type: FormStateActions.SetField,
      payload: {
        key: 'secondaryOptions',
        value: secondaryGroups,
      },
    });
  }, [secondaryGroups]);

  const changeActiveProduct = useCallback(
    (optionName: string) => {
      const product: Product | undefined = mainGroup.options.get(optionName);
      if (!product) return;

      dispatchActiveProduct({
        type: ProductStateActions.SetProduct,
        payload: { product },
      });

      // update input fields's values
      setValue('name', product.name);
      setValue('price', product.price || NaN); // empty field if price is 0
      setValue('images', product.images);
      setValue('description', product.description);
    },
    [mainGroup, setValue],
  );

  // Change active product when the new one is added
  useEffect(() => {
    if (
      !mainGroupPrevState.current ||
      // don't do anything if the number of items wasn't changed or item was deleted
      mainGroup.options.size <= mainGroupPrevState.current.options.size
    ) {
      mainGroupPrevState.current = mainGroup;
      return;
    }

    const options: Product[] = Array.from(mainGroup.options.values());
    const newOption = options[options.length - 1];
    changeActiveProduct(newOption.optionName);

    mainGroupPrevState.current = mainGroup;
  }, [changeActiveProduct, mainGroup]);

  // Validate only active product each time it will be changed to another
  // instead of validating every product
  const validateActiveProduct = (): boolean => {
    const res = productInfoScheme.safeParse(activeProduct);
    if (!res.success) {
      res.error.errors.forEach((err) => {
        setError(
          err.path[0] as keyof TUploadProduct,
          { message: err.message },
          { shouldFocus: true },
        );
      });

      return false;
    }

    return true;
  };

  // =-=-=-=-=-=-=-=-=-=-= Main group handlers =-=-=-=-=-=-=-=-=-=-=
  const onMainOptionCreate = () => {
    if (!validateActiveProduct()) return;
    dispatchMainGroup({
      type: MainGroupActions.CreateNewOption,
    });
  };

  const onMainOptionClick = (optionName: string) => {
    if (optionName === activeProduct.optionName) return;
    if (!validateActiveProduct()) return;

    changeActiveProduct(optionName);
  };

  const onMainOptionDelete = (optionName: string) => {
    if (mainGroup.options.size === 1) return;

    // if active product was deleted, then make the previous product in the map active
    // or next if it was the first item in the map
    if (optionName === activeProduct.optionName) {
      const optionNames: string[] = Array.from(
        mainGroup.options.values().map((option) => option.optionName),
      );

      const currIdx = optionNames.indexOf(optionName);
      const newIdx = currIdx === 0 ? currIdx + 1 : currIdx - 1;

      changeActiveProduct(optionNames[newIdx]);
    }

    dispatchMainGroup({
      type: MainGroupActions.RemoveOption,
      payload: { optionName },
    });
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-4"
    >
      {/* single product or multiple variants mode*/}
      <div className="flex w-full flex-col">
        <Title className="mb-2">
          Current mode
          <Tooltip
            className="inline text-sm"
            tooltipClassName="max-sm:max-w-36"
            tooltipId="uploading-mode-tooltip"
            tooltip={`Single product: just a single variant of the product.
              Multiple variants: you can upload several products within 1 page that differ in some options`}
          >
            <CircleHelp className="inline h-4 cursor-pointer text-gray-400" />
          </Tooltip>
        </Title>
        <div className="flex max-sm:justify-center">
          <ToggleSwitch
            aria-describedby="uploading-mode-tooltip"
            id="product-mode"
            checked={formState.isMultipleMode}
            checkedLabel="Multiple variants"
            uncheckedLabel="Single product"
            toggle={(state: boolean) => {
              dispatchFormState({
                type: FormStateActions.SetMode,
                payload: { isMultipleMode: state },
              });
            }}
          />
        </div>
      </div>

      {/* categories */}
      <div className="">
        <Title className="mb-2">
          Where will you post your product?
          {formState.isMultipleMode && (
            <span className="line-h-1 ml-1 align-middle text-xs font-light text-gray-400">
              (shared for all variants)
            </span>
          )}
        </Title>
        <div className="flex justify-center gap-4 max-md:flex-col">
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
                containerClassName=""
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
                containerClassName=""
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
        <Title>Product info</Title>
        <div className="">
          <div className="grid grid-cols-4 gap-2 max-md:grid-cols-3 max-sm:grid-cols-1 max-sm:gap-0">
            <InputField
              id="name"
              register={register('name')}
              containerProps={{
                className: 'col-span-3 max-md:col-span-2 max-sm:col-span-1',
              }}
              error={errors.name}
              fullWidth
              label="Name"
              maxLength={PRODUCT_FIELDS_LIMITS.product.nameLength}
              placeholder="My product"
              type="text"
            />

            <InputField
              id="price"
              register={register('price', { valueAsNumber: true })}
              error={errors.price}
              fullWidth
              label="Price"
              max={PRODUCT_FIELDS_LIMITS.maxPrice}
              placeholder="1.00$"
              type="number"
            />
          </div>
        </div>

        <Controller
          control={control}
          name="images"
          render={({ field: { onChange, value } }) => (
            <ImageDropzone
              id="images"
              className="mb-px" // when this field outlined (error),
              // the title of focused field below will cover part of this border
              errorMessage={errors.images?.message}
              maxFiles={PRODUCT_FIELDS_LIMITS.product.imageCount}
              multiple
              name="images"
              onChange={onChange}
              values={value}
            />
          )}
        />

        <InputField
          id="description"
          register={register('description')}
          className="h-36"
          component="textarea"
          error={errors.description}
          fullWidth
          label="Description"
          maxLength={PRODUCT_FIELDS_LIMITS.product.descriptionLength}
          placeholder="About product"
        />
      </div>

      {/* option groups and their options */}
      {formState.isMultipleMode && (
        <Groups
          activeProduct={activeProduct}
          dispatchMainGroup={dispatchMainGroup}
          dispatchSecondaryGroups={dispatchSecondaryGroups}
          mainGroup={mainGroup}
          onMainOptionClick={onMainOptionClick}
          onMainOptionCreate={onMainOptionCreate}
          onMainOptionDelete={onMainOptionDelete}
          secondaryGroups={secondaryGroups}
        />
      )}

      {/* additional services */}
      <div className="">
        <Title className="mb-2">Additional services</Title>
        <ServicesList
          additionalServices={additionalServices}
          dispatch={dispatchAdditionalServices}
        />
      </div>

      <button
        disabled={isSubmitting}
        className="w-fit rounded border border-black px-4 py-2"
      >
        Submit
      </button>

      {errors.root && <Error>{errors.root.message}</Error>}
    </form>
  );
};

export default NewProductForm;
