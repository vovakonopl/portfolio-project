import { IFormState } from '@/app/upload-product/_utils/form-state-interface';

export enum FormStateActions {
  SetMode,
  SetField,
}

type TAction =
  | {
      type: FormStateActions.SetMode;
      payload: { isMultipleMode: boolean };
    }
  | {
      type: FormStateActions.SetField;
      payload: { key: keyof IFormState; value: IFormState[keyof IFormState] };
    };

export function formReducer(state: IFormState, action: TAction) {
  switch (action.type) {
    case FormStateActions.SetMode:
      return { ...state, isMultipleMode: action.payload.isMultipleMode };

    case FormStateActions.SetField: {
      const { key, value } = action.payload;
      const newState: IFormState = { ...state };
      (newState[key] as typeof value) = value;

      return newState;
    }

    default:
      return state;
  }
}
