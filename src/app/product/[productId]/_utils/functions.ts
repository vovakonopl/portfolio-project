import {
  TGroupsMap,
  TSearchParams,
  TSelectedOptions,
} from '@/app/product/[productId]/_utils/types';
import { TProduct } from '@/types/product';
import { ProductVariant, SecondaryOption } from '@prisma/client';

function isString(val: any): val is string {
  return typeof val === 'string';
}

// returns an object of selected options
export function getSelectedOptionsFromParams(
  searchParams: TSearchParams,
  groupsMap: TGroupsMap,
): TSelectedOptions {
  const result: TSelectedOptions = {};
  for (const group of groupsMap.keys()) {
    const selectedOption = searchParams[group];
    if (
      !isString(selectedOption) || // invalid value or missing
      !groupsMap.get(group)?.has(selectedOption) // invalid option
    ) {
      const defaultOption = groupsMap.get(group)!.values().next().value;
      if (isString(defaultOption?.optionName)) {
        // must be always true
        result[group] = defaultOption.optionName;
      }

      continue;
    }

    result[group] = selectedOption;
  }

  return result;
}

export function createURLSearchParams(params: {
  groupsMap: TGroupsMap;
  newOptions: TSelectedOptions;
  selectedOptions: TSelectedOptions;
}): URLSearchParams {
  const result: TSelectedOptions = { ...params.selectedOptions };

  for (const key in params.newOptions) {
    const optionMap = params.groupsMap.get(key);
    if (!optionMap) continue;

    const option: string = params.newOptions[key];
    if (!optionMap.has(option)) continue;

    result[key] = option;
  }

  return new URLSearchParams(result);
}

type TNameAndPrice = {
  name: string;
  price: number;
};

export function generatePriceAndName(
  activeVariant: TProduct | ProductVariant,
  selectedSecondaryOptions: SecondaryOption[],
): TNameAndPrice {
  let name: string = activeVariant.name;
  let price: number = activeVariant.priceInCents;

  for (const option of selectedSecondaryOptions) {
    if (option.name) name += `, ${option.name}`;
    if (option.priceInCents) price += option.priceInCents;
  }

  price /= 100;
  return { name, price };
}
