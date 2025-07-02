import { Product } from '@/types/product/product';

export enum ProductStateActions {
  SetField,
  SetProduct,
}

type TAction<K extends keyof Product = keyof Product> =
  | {
      type: ProductStateActions.SetField;
      payload: { field: K; value: Product[K] };
    }
  | { type: ProductStateActions.SetProduct; payload: { product: Product } };

export function productReducer<K extends keyof Product = keyof Product>(
  state: Product,
  action: TAction<K>,
) {
  switch (action.type) {
    case ProductStateActions.SetField: {
      const newState = { ...state };
      newState[action.payload.field] = action.payload.value;

      return newState;
    }

    case ProductStateActions.SetProduct:
      return action.payload.product;

    default:
      return state;
  }
}
