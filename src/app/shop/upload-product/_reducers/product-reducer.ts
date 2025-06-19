import { Product } from '@/app/shop/upload-product/_utils/structures/product';

export enum ProductStateActions {
  SetField,
}

type TAction<K extends keyof Product = keyof Product> = {
  type: ProductStateActions.SetField;
  payload: { field: K; value: Product[K] };
};

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

    default:
      return state;
  }
}
