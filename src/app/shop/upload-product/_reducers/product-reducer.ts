import { IProduct } from '@/app/shop/upload-product/_utils/structures/product-interface';

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
