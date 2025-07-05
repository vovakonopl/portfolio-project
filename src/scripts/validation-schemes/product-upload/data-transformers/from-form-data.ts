import { z } from 'zod';
import {
  productScheme,
  TProduct,
} from '@/scripts/validation-schemes/product-upload/product-scheme';
import {
  formDataKey,
  mergeStrings,
} from '@/scripts/validation-schemes/product-upload/data-transformers/utils';
import { TTransformedData } from '@/scripts/validation-schemes/product-upload/data-transformers/to-form-data';
import { TMainOptionMap, TOptionGroups } from '@/types/product/option-groups';
import { Product } from '@/types/product/product';
import {
  AdditionalService,
  TServiceMap,
} from '@/types/product/additional-service';

const formDataScheme = z.custom<FormData>(
  (data) => data instanceof FormData && data.has(formDataKey),
  {
    message: `Input must be a FormData object with ${formDataKey} key.`,
  },
);

export const transformFromFormDataScheme = formDataScheme
  .transform((formData: FormData): TProduct | null => {
    const productDataJson = formData.get(formDataKey)!;
    if (productDataJson instanceof File) return null;

    const data: TTransformedData = JSON.parse(productDataJson);

    // Wrap the code in a try-catch block in case of object type mismatch
    try {
      // Variants
      const variantEntries: [string, Product][] = data.variants.options.map(
        (variant: Product) => {
          // adding images
          const key: keyof TProduct = 'variants';
          let idx: number = 0;
          let image: File | undefined = undefined;

          do {
            image = formData.get(
              mergeStrings(key, variant.optionName, `${idx}`),
            ) as File | undefined;
            idx++;
          } while (image);

          return [variant.optionName, variant];
        },
      );
      const variants: TMainOptionMap = new Map(variantEntries);

      // Secondary options
      const groupEntries: [string, Map<string, any>][] =
        data.secondaryOptions.map(([group, options]) => {
          const optionEntries = options.map(
            (option): [string, typeof option] => [option.displayedName, option],
          );
          const optionMap = new Map(optionEntries);

          return [group, optionMap];
        });
      const secondaryOptions: TOptionGroups = new Map(groupEntries);

      // Services
      const serviceEntries: [string, AdditionalService][] =
        data.additionalServices.map((service) => {
          // adding images
          const key: keyof TProduct = 'additionalServices';
          service.image = formData.get(mergeStrings(key, service.name)) as
            | File
            | undefined;

          return [service.name, service];
        });
      const additionalServices: TServiceMap = new Map(serviceEntries);

      // Constructing final object
      return {
        variants: {
          name: data.variants.name,
          options: variants,
        },
        secondaryOptions,
        additionalServices,
        category: data.category,
        subcategory: data.subcategory,
      };
    } catch (error) {
      console.error('Error processing FormData:', error);
      return null;
    }
  })
  .refine((data) => data !== null, { message: 'Invalid form data.' })
  .superRefine((data, ctx) => {
    const parsedData = productScheme.safeParse(data);
    if (!parsedData.success) {
      parsedData.error.errors.forEach((error) => {
        ctx.addIssue(error);
      });

      return false;
    }

    return true;
  })
  .transform((data) => productScheme.safeParse(data).data);
