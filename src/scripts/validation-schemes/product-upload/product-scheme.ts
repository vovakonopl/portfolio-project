import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { categoriesScheme } from '@/scripts/validation-schemes/product-upload/categories-scheme';
import { optionMapScheme } from '@/scripts/validation-schemes/product-upload/option-scheme';
import { productInfoMapScheme } from '@/scripts/validation-schemes/product-upload/product-info-scheme';
import { serviceMapScheme } from '@/scripts/validation-schemes/product-upload/service-scheme';
import { GROUPS } from '@/constants/product/groups';
import { createNameScheme } from '@/scripts/validation-schemes/product-upload/utils';

const groupNameScheme = createNameScheme(
  'group',
  PRODUCT_FIELDS_LIMITS.option.nameLength,
);

export const productScheme = z
  .object({
    variants: z.object({
      name: groupNameScheme,
      options: productInfoMapScheme,
    }),

    secondaryOptions: z
      .map(groupNameScheme, optionMapScheme)
      .refine((map) => map.size <= GROUPS.maxSecondaryGroups, {
        message: `Maximum number of groups is ${GROUPS.maxSecondaryGroups}.`,
      }),

    additionalServices: serviceMapScheme,
  })
  .merge(categoriesScheme);

export type TProduct = z.infer<typeof productScheme>;

// Remove option and add its values to all variants
// if secondary group contains a single option or remove group if it's empty
export function filterGroups(data: TProduct) {
  for (const groupName of data.secondaryOptions.keys()) {
    const optionGroup = data.secondaryOptions.get(groupName)!;
    if (optionGroup.size > 1) continue;
    if (optionGroup.size === 0) {
      data.secondaryOptions.delete(groupName);
      continue;
    }

    const option = optionGroup.values().next().value!;
    for (const variant of data.variants.options.values()) {
      if (option.name) {
        variant.name += `, ${option.name}`;
      }

      variant.price += option.price || 0;
    }

    data.secondaryOptions.delete(groupName);
  }

  return data;
}
