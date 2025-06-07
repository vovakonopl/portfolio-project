import { Category, SubCategory } from '@prisma/client';

export interface IProduct {
  idx: number; // index of the product in the list

  name: string;
  price: number;
  images: Array<File>;
  category: Category;
  subcategory: SubCategory;
  description?: string;

  // additional properties for variants (multiple variants mode)
  optionGroup?: string;
  optionName?: string;
}

export enum ProductStateActions {
  SetField,
}

type TAction<K extends keyof IProduct = keyof IProduct> = {
  type: ProductStateActions.SetField;
  payload: { field: K; value: IProduct[K] };
};

export function productReducer<K extends keyof IProduct = keyof IProduct>(
  state: IProduct,
  action: TAction<K>,
) {
  switch (action.type) {
    case ProductStateActions.SetField: {
      const newState = { ...state };
      newState[action.payload.field] = action.payload.value;

      return newState;
    }

    default:
      return state;
  }
}
