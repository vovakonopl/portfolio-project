import {
  productScheme,
  TProduct,
} from '@/scripts/validation-schemes/product-upload/product-scheme';
import {
  formDataKey,
  getKeys,
  mergeStrings,
} from '@/scripts/validation-schemes/product-upload/data-transformers/utils';
import { AdditionalService } from '@/types/product/additional-service';
import { Product } from '@/types/product/product';
import { SecondaryOption } from '@/types/product/secondary-option';

type TSecondaryOption = Partial<SecondaryOption> & { displayedName: string };
export type TTransformedData = {
  variants: {
    options: Product[];
    name: string;
  };
  secondaryOptions: [string, TSecondaryOption[]][];
  additionalServices: AdditionalService[];
  categoryId: string;
  subCategoryId: string;
};

export const transformToFormDataScheme = productScheme.transform(
  (data: TProduct): FormData => {
    const formData = new FormData();
    const keys = getKeys(data);

    // Variants
    const variants = Array.from(data.variants.options.values());
    for (const variant of variants) {
      if (variant.images.length === 0) continue;

      variant.images.forEach((image: File, idx: number) => {
        formData.append(
          mergeStrings(keys.variants, variant.optionName, `${idx}`),
          image,
        );
      });
      variant.images = [];
    }

    // Secondary options
    const groupsEntries = Array.from(data.secondaryOptions.keys()).map(
      (group: string): [string, TSecondaryOption[]] => {
        const options = Array.from(data.secondaryOptions.get(group)!.values());
        return [group, options];
      },
    );

    // Services
    const services = Array.from(data.additionalServices.values());
    for (const service of services) {
      if (!service.image) continue;

      formData.append(
        mergeStrings(keys.additionalServices, service.name),
        service.image,
      );
      service.image = undefined;
    }

    const transformedObj: TTransformedData = {
      ...data,
      variants: { ...data.variants, options: variants },
      secondaryOptions: groupsEntries,
      additionalServices: services,
    };
    const dataJson = JSON.stringify(transformedObj);
    formData.append(formDataKey, dataJson);

    return formData;
  },
);
