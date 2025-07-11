import { GROUPS } from '@/constants/product/groups';
import { Product } from '@/types/product/product';
import { TMainGroup, TMainOptionMap } from '@/types/product/option-groups';

export enum MainGroupActions {
  RenameOptionGroup,
  CreateNewOption,
  RemoveOption,
  RenameOption,
  ReorderOptionGroups,
  UpdateOption,
}

export type TAction =
  | {
      type: MainGroupActions.RenameOptionGroup;
      payload: { newName: string };
    }
  | {
      type: MainGroupActions.CreateNewOption;
    }
  | {
      type: MainGroupActions.RemoveOption;
      payload: { optionName: string };
    }
  | {
      type: MainGroupActions.RenameOption;
      payload: { optionName: string; newName: string };
    }
  | {
      type: MainGroupActions.ReorderOptionGroups;
      payload: { newOrder: string[] };
    }
  | {
      type: MainGroupActions.UpdateOption;
      payload: { option: Product };
    };

export function mainOptionGroupReducer(
  state: TMainGroup,
  action: TAction,
): TMainGroup {
  switch (action.type) {
    case MainGroupActions.RenameOptionGroup: {
      const { newName } = action.payload;
      if (newName.length < 1) return state;

      return { ...state, name: newName };
    }

    case MainGroupActions.CreateNewOption: {
      if (state.options.size >= GROUPS.maxOptionCount) {
        return state;
      }

      const findNextOptionName = (prevNum: number): string => {
        const optionName = 'Option' + (prevNum + 1);
        if (!state.options.has(optionName)) {
          return optionName;
        }

        return findNextOptionName(prevNum + 1);
      };

      const optionName = findNextOptionName(state.options.size);
      const option = new Product({ optionName });
      const options = new Map(state.options).set(optionName, option);

      return { ...state, options };
    }

    case MainGroupActions.RemoveOption: {
      const { optionName } = action.payload;
      if (!state.options.has(optionName)) {
        return state; // Option does not exist in the group
      }

      const options = new Map(state.options);
      options.delete(optionName);

      return { ...state, options };
    }

    case MainGroupActions.RenameOption: {
      const { optionName, newName } = action.payload;
      if (!state.options.has(optionName) || state.options.has(newName)) {
        return state; // Option does not exist in the group or new name already exists
      }

      type TEntry = [string, Product];
      const optionEntries = state.options
        .entries()
        .map(([optName, option]: TEntry): TEntry => {
          if (optionName === optName) {
            option.optionName = newName;
            return [newName, option];
          }

          return [optName, option];
        });

      const options = new Map(optionEntries);
      return { ...state, options };
    }

    case MainGroupActions.ReorderOptionGroups: {
      const { newOrder } = action.payload;
      if (newOrder.length !== state.options.size) {
        return state; // The number of options does not match
      }

      const options: TMainOptionMap = new Map();
      for (const optionName of newOrder) {
        if (!state.options.has(optionName)) {
          return state; // One of the options does not exist
        }

        options.set(optionName, state.options.get(optionName)!);
      }

      return { ...state, options };
    }

    case MainGroupActions.UpdateOption: {
      const { option } = action.payload;
      const options = new Map(state.options).set(option.optionName, option);
      return { ...state, options };
    }

    default:
      return state;
  }
}
