import { ProductVariant, SecondaryOption } from '@prisma/client';
import { TProduct } from '@/types/product';

// key - option name; value - option
export type TOptionsMap = Map<
  string,
  SecondaryOption | ProductVariant | TProduct
>;

// key: group name; value - map of options
export type TGroupsMap = Map<string, TOptionsMap>;

export type TSearchParams = { [key: string]: string | string[] | undefined };

export type TSelectedOptions = Record<string, string>;
