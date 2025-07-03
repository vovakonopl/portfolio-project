import { z } from 'zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { categoriesByIdScheme } from '@/scripts/validation-schemes/product-upload/categories-scheme';
import { optionScheme } from '@/scripts/validation-schemes/product-upload/option-scheme';
import { productInfoScheme } from '@/scripts/validation-schemes/product-upload/product-info-scheme';
import { serviceScheme } from '@/scripts/validation-schemes/product-upload/service-scheme';
import { GROUPS } from '@/constants/product/groups';
import { MAX_SERVICES } from '@/constants/product/services';

// Verifies that every key of the map equals to specified property of the stored object
function refineMapKeys<T>(
  map: Map<string, T>,
  ctx: z.RefinementCtx,
  objectKey: keyof T,
) {
  for (const key of map.keys()) {
    if (key === map.get(key)![objectKey]) continue;

    ctx.addIssue({
      code: 'custom',
      message: 'Map keys must match the corresponding option names.',
      path: [key],
    });
  }
}

// Creates schemes for group/option/service names
function createNameScheme(
  nameType: 'group' | 'option' | 'service',
  maxLength: number,
) {
  const capitalised: string = nameType[0].toUpperCase() + nameType.slice(1);
  return z
    .string({ message: 'Must be a string.' })
    .min(1, { message: `${capitalised} name required.` })
    .max(maxLength, {
      message: `Maximum length of ${nameType} name is ${maxLength} characters.`,
    });
}

const groupNameScheme = createNameScheme(
  'group',
  PRODUCT_FIELDS_LIMITS.option.nameLength,
);
const optionNameScheme = createNameScheme(
  'option',
  PRODUCT_FIELDS_LIMITS.option.nameLength,
);
const serviceNameScheme = createNameScheme(
  'service',
  PRODUCT_FIELDS_LIMITS.service.nameLength,
);

export const productScheme = z
  .object({
    variants: z.object({
      name: groupNameScheme,
      options: z
        .map(
          z.string({ message: 'Must be a string.' }),
          productInfoScheme.extend({
            optionName: optionNameScheme,
          }),
        )
        .refine((map) => map.size > 0, {
          message: 'At least 1 product variant is required.',
        })
        .refine((map) => map.size <= GROUPS.maxOptionCount, {
          message: `Maximum number of variants is ${GROUPS.maxOptionCount}.`,
        })
        .superRefine((map, ctx) => refineMapKeys(map, ctx, 'optionName')),
    }),

    secondaryOptions: z
      .map(
        groupNameScheme,
        z
          .map(optionNameScheme, optionScheme)
          .refine((map) => map.size <= GROUPS.maxOptionCount, {
            message: `Maximum number of options is ${GROUPS.maxOptionCount}.`,
          })
          .superRefine((map, ctx) => refineMapKeys(map, ctx, 'displayedName')),
      )
      .refine((map) => map.size <= GROUPS.maxSecondaryGroups, {
        message: `Maximum number of groups is ${GROUPS.maxSecondaryGroups}.`,
      }),

    additionalServices: z
      .map(serviceNameScheme, serviceScheme)
      .refine((map) => map.size <= MAX_SERVICES, {
        message: `Maximum number of services is ${MAX_SERVICES}.`,
      })
      .superRefine((map, ctx) => refineMapKeys(map, ctx, 'name')),
  })
  .merge(categoriesByIdScheme)
  .transform((data) => {
    // Remove option and add its values to all variants
    // if secondary group contains a single option or remove group if it's empty
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
  });

export type TProduct = z.infer<typeof productScheme>;
