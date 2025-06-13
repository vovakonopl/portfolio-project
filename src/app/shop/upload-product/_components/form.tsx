'use client';

import { FC, useEffect, useReducer, useRef, useState } from 'react';
import { Category, SubCategory } from '@prisma/client';
import {
  TUploadProduct,
  uploadProductScheme,
} from '@/scripts/validation-schemes/product-upload-scheme';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import ImageDropzone from '@/components/ui/dropzone';
import InputField from '@/components/ui/text-input-field';
import Error from '@/components/ui/error-message';
import Select from '@/components/ui/select/select';
import SelectOption from '@/components/ui/select/select-option';
import SelectInputField from '@/components/ui/select/select-input-field';
import { ToggleSwitch } from '@/components/ui/toggle-switch';
import Tooltip from '@/components/ui/tooltip';
import { CircleHelp } from 'lucide-react';
import Title from './form-title';
import OptionGroup from './product-options/option-group';
import {
  formReducer,
  FormStateActions,
  IFormState,
} from '../_reducers/form-reducer';
import {
  IProduct,
  productReducer,
  ProductStateActions,
} from '../_reducers/product-reducer';
import {
  optionGroupReducer,
  OptionGroupsActions,
  TOptionGroups,
} from '../_reducers/option-groups-reducer';
import GroupList from '@/app/shop/upload-product/_components/product-options/group-list';

const initialFormState: IFormState = {
  isMultipleMode: false,
  variants: [],
  // additionalServices: ...
};

const initialProductState: IProduct = {
  idx: 0,
  name: '',
  price: 0,
  images: [],
  category: {} as Category,
  subcategory: {} as SubCategory,
  description: '',

  // additional properties for variants (multiple variants mode)
  optionGroup: '',
  optionName: '',
};

// TODO: remove this test data
const TEST_initialOptionGroups: TOptionGroups = new Map([
  [
    'group1',
    new Set([
      'option1',
      'option2',
      'option3',
      'option4',
      'option5',
      'option6',
      'option7',
      'option8',
      'option9',
      'option10',
    ]),
  ],
  ['group2', new Set(['option1', 'option2', 'option3'])],
  ['group3', new Set(['option1', 'option2'])],
  ['group4', new Set(['option1'])],
  ['group5', new Set()],
]);

interface INewProductFormProps {
  categories: Array<Category>;
  subCategories: Map<string, Array<SubCategory>>;
}

const NewProductForm: FC<INewProductFormProps> = ({
  categories,
  subCategories,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [optionGroups, dispatchOptionGroups] = useReducer(
    optionGroupReducer,
    // new Map<string, Set<string>>(),
    TEST_initialOptionGroups,
  );
  const [activeProduct, dispatchActiveProduct] = useReducer(
    productReducer,
    initialProductState,
  );
  const [formState, dispatchFormState] = useReducer(
    formReducer,
    initialFormState,
  );
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    getValues,
    setError,
    watch,
  } = useForm<TUploadProduct>({
    resolver: zodResolver(uploadProductScheme),
  });

  // update product state on value change
  useEffect(() => {
    const { unsubscribe } = watch((value, { name }) => {
      if (!name) return unsubscribe;

      dispatchActiveProduct({
        type: ProductStateActions.SetField,
        payload: {
          field: name as keyof IProduct,
          value: value as IProduct[keyof IProduct],
        },
      });
    });

    return unsubscribe;
  }, [watch]);

  // update form state when product state changes
  useEffect(() => {
    dispatchFormState({
      type: FormStateActions.EditVariant,
      payload: {
        product: activeProduct,
      },
    });
  }, [activeProduct]);

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

  /*
  const createOptionGroup = (groupName: string): boolean => {
    if (optionGroups.has(groupName)) return false;

    setOptionGroups((prev) => {
      // clear other empty groups
      const newMap = new Map(prev);
      for (const [key, value] of newMap.entries()) {
        if (value.size === 0) {
          newMap.delete(key);
        }
      }

      // add a new group
      newMap.set(groupName, new Set());
      return newMap;
    });

    return true;
  };

  const addOptionName = (optionGroup: string, optionName: string): boolean => {
    if (optionGroups.get(optionGroup)?.has(optionName)) return false;

    // add option name to the group
    setOptionGroups((prev) => {
      const newMap = new Map(prev);
      const optionNames: TOptionNames | undefined = newMap.get(optionGroup);
      if (!optionNames) return prev;

      optionNames.add(optionName);
      return newMap;
    });

    return true;
  };
  */

  const onGroupReorder = (newOrder: string[]) => {
    dispatchOptionGroups({
      type: OptionGroupsActions.ReorderOptionGroups,
      payload: { newOrder },
    });
  };

  const onGroupDelete = (optionGroupName: string) => {
    dispatchOptionGroups({
      type: OptionGroupsActions.RemoveOptionGroup,
      payload: { optionGroupName },
    });
  };

  const onOptionReorder = (
    optionGroupName: string,
    options: string[] | Set<string>,
  ) => {
    dispatchOptionGroups({
      type: OptionGroupsActions.SetOptionGroup,
      payload: { optionGroupName, options },
    });
  };

  const onOptionDelete = (optionGroupName: string, optionName: string) => {
    dispatchOptionGroups({
      type: OptionGroupsActions.RemoveOption,
      payload: { optionGroupName, optionName },
    });
  };

  const onOptionRename = (
    optionGroupName: string,
    option: string,
    newName: string,
  ) => {
    dispatchOptionGroups({
      type: OptionGroupsActions.RenameOption,
      payload: { optionGroupName, option, newName },
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
        <ToggleSwitch
          aria-describedby="uploading-mode-tooltip"
          id="product-mode"
          checked={formState.isMultipleMode}
          toggle={(state: boolean) => {
            dispatchFormState({
              type: FormStateActions.SetMode,
              payload: { isMultipleMode: state },
            });
          }}
          uncheckedLabel="Signgle product"
          checkedLabel="Multiple variants"
        />
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
                <SelectInputField
                  placeholder="Add new group"
                  id="test-inp"
                  autoComplete="off"
                />
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
              className="mb-px" // when this field outlined (error),
              // the title of focused field below will cover part of this border
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

      {/* option groups and their options */}
      {/* TODO: Each group name and option name can be removed or change their names. */}
      {/* TODO: Option groups and options can be dragged to change the order in which they will be displayed */}
      {/* TODO: Main group is separated from other. If there is only one product in main group, group name and option name can be unspecified */}
      {/* TODO: If there is only one variant, it counts as product from single mode */}
      {/* TODO: Module window appears to add a new NOT MAIN group. Otherwise fields in Product info resets and new variant is added */}
      {/* TODO: When button for new variant in main group is pressed, validate the current before going to the next*/}
      {/* TODO: If there is only 1 option in secondary groups, instead of creating such group just add what need to be added to all variants */}
      {formState.isMultipleMode && (
        <div className="">
          <Title>Option groups</Title>
          <div className="px-4">
            <h5 className="mb-2 text-sm font-medium">
              Main group
              <Tooltip
                className="inline text-sm"
                tooltipId="main-group-tooltip"
                tooltip={`Only variants in main group can have different images and description.
                Other groups can only add text to name or price (both will be calculated as sum of all selected variants).
                You can disable several combinations of secondary options with main options.`}
              >
                <CircleHelp className="inline h-4 cursor-pointer text-gray-400" />
              </Tooltip>
            </h5>
            {/* TODO: by default a placeholder with group name = Main; option name = default */}
            {/*<div aria-describedby='main-group-tooltip'></div>*/}

            <h5 className="mb-2 text-sm font-medium">Secondary groups</h5>
            <GroupList
              optionGroups={optionGroups}
              onGroupReorder={onGroupReorder}
              onGroupDelete={onGroupDelete}
              onOptionReorder={onOptionReorder}
              onOptionDelete={onOptionDelete}
            />

            <Tooltip
              className="inline text-sm"
              tooltipClassName="max-sm:max-w-36"
              tooltipId="add-variant-tooltip"
              tooltip="Add a new product variant to the main group."
            >
              <button
                aria-describedby="add-variant-tooltip"
                // before adding new variants,
                className="w-fit rounded border border-black px-4 py-2"
              >
                Add new group
              </button>
            </Tooltip>
          </div>
        </div>
      )}

      {/* additional services */}

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
