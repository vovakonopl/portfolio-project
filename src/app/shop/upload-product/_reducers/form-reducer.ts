import { IProduct } from '@/app/shop/upload-product/_utils/structures/product-interface';
import { IFormState } from '@/app/shop/upload-product/_utils/structures/form-state-interface';

export enum FormStateActions {
  SetMode,
  AppendVariant,
  RemoveVariant,
  EditVariant,
}

type TAction =
  | {
      type: FormStateActions.SetMode;
      payload: { isMultipleMode: boolean };
    }
  | {
      type: FormStateActions.AppendVariant | FormStateActions.EditVariant;
      payload: { product: IProduct };
    }
  | {
      type: FormStateActions.RemoveVariant;
      payload: { optionGroup: string; optionName: string };
    };

export function formReducer(state: IFormState, action: TAction) {
  switch (action.type) {
    case FormStateActions.SetMode:
      return { ...state, isMultipleMode: action.payload.isMultipleMode };

    case FormStateActions.AppendVariant:
      return {
        ...state,
        variants: [...state.variants, action.payload.product],
      };

    case FormStateActions.RemoveVariant: {
      const variants: IProduct[] = state.variants.filter(
        (variant) =>
          variant.optionGroup !== action.payload.optionGroup ||
          variant.optionGroup !== action.payload.optionName,
      );
      return { ...state, variants };
    }

    case FormStateActions.EditVariant: {
      const newState = { ...state };
      newState.variants[action.payload.product.idx] = action.payload.product;

      return newState;
    }

    default:
      return state;
  }
}
