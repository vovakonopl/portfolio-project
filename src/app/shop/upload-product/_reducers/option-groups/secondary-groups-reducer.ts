import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import {
  TOptionGroups,
  TOptionMap,
} from '@/app/shop/upload-product/_utils/structures/option-groups';
import {
  MAX_OPTIONS_IN_GROUP,
  MAX_SECONDARY_GROUPS,
} from '@/app/shop/upload-product/_utils/constants';

export enum SecondaryGroupsActions {
  AddOptionGroup,
  RemoveOptionGroup,
  RenameOptionGroup,
  AddOption,
  RemoveOption,
  RenameOption,
  ReorderOptionGroups,
  SetOptionGroup,
}

export type TAction =
  | {
      type:
        | SecondaryGroupsActions.AddOptionGroup
        | SecondaryGroupsActions.RemoveOptionGroup;
      payload: { optionGroupName: string };
    }
  | {
      type: SecondaryGroupsActions.AddOption;
      payload: { optionGroupName: string; option: SecondaryOption };
    }
  | {
      type: SecondaryGroupsActions.RemoveOption;
      payload: { optionGroupName: string; optionName: string };
    }
  | {
      type: SecondaryGroupsActions.RenameOptionGroup;
      payload: { optionGroupName: string; newName: string };
    }
  | {
      type: SecondaryGroupsActions.RenameOption;
      payload: { optionGroupName: string; optionName: string; newName: string };
    }
  | {
      type: SecondaryGroupsActions.ReorderOptionGroups;
      payload: { newOrder: string[] };
    }
  | {
      type: SecondaryGroupsActions.SetOptionGroup;
      payload: {
        optionGroupName: string;
        options: SecondaryOption[] | TOptionMap;
      };
    };

export function secondaryGroupsReducer(
  state: TOptionGroups,
  action: TAction,
): TOptionGroups {
  switch (action.type) {
    case SecondaryGroupsActions.AddOptionGroup: {
      if (state.size >= MAX_SECONDARY_GROUPS) {
        return state;
      }

      const { optionGroupName } = action.payload;
      if (optionGroupName.length === 0) {
        return state; // Empty string
      }
      if (state.has(optionGroupName)) {
        return state; // Option group already exists
      }

      const newState = new Map(state);
      newState.set(optionGroupName, new Map());
      return newState;
    }

    case SecondaryGroupsActions.RemoveOptionGroup: {
      const { optionGroupName } = action.payload;
      if (!state.has(optionGroupName)) {
        return state; // Option group does not exist
      }

      const newState = new Map(state);
      newState.delete(optionGroupName);
      return newState;
    }

    case SecondaryGroupsActions.RenameOptionGroup: {
      const { optionGroupName, newName } = action.payload;
      if (!state.has(optionGroupName) || state.has(newName)) {
        return state; // Option group does not exist or new name already exists
      }

      type TEntry = [string, TOptionMap];
      const entries = state
        .entries()
        .map(([groupName, optionMap]: TEntry): TEntry => {
          const newOptionMap: TOptionMap = new Map(optionMap);
          if (groupName === optionGroupName) return [newName, newOptionMap];
          return [groupName, newOptionMap];
        });

      return new Map(entries);
    }

    case SecondaryGroupsActions.AddOption: {
      if (state.size >= MAX_OPTIONS_IN_GROUP) {
        return state;
      }

      const { optionGroupName, option } = action.payload;
      if (!state.has(optionGroupName)) {
        return state; // Option group does not exist
      }
      if (state.get(optionGroupName)!.has(option.displayedName)) {
        return state; // Option already exists in the group
      }

      const newState = new Map(state);
      const optionMap = newState.get(optionGroupName)!;
      optionMap.set(option.displayedName, option);
      newState.set(optionGroupName, new Map(optionMap));

      return newState;
    }

    case SecondaryGroupsActions.RemoveOption: {
      const { optionGroupName, optionName } = action.payload;
      if (!state.get(optionGroupName)?.has(optionName)) {
        return state; // Option group or option does not exist in the group
      }

      const newState = new Map(state);
      const optionMap = new Map(newState.get(optionGroupName));
      optionMap.delete(optionName);
      newState.set(optionGroupName, optionMap);

      return newState;
    }

    case SecondaryGroupsActions.RenameOption: {
      const { optionGroupName, optionName, newName } = action.payload;
      if (!state.has(optionGroupName)) {
        return state; // Option group does not exist
      }

      const optionMap = state.get(optionGroupName);
      if (!optionMap || !optionMap.has(optionName) || optionMap.has(newName)) {
        return state; // Option does not exist in the group or new name already exists
      }

      type TEntry = [string, SecondaryOption];
      const optionEntries = optionMap
        .entries()
        .map(([optName, option]: TEntry): TEntry => {
          if (optionName === optName) {
            option.displayedName = newName;
            return [newName, option];
          }

          return [optName, option];
        });

      const newState = new Map(state);
      newState.set(optionGroupName, new Map(optionEntries));

      return newState;
    }

    case SecondaryGroupsActions.ReorderOptionGroups: {
      const { newOrder } = action.payload;
      if (newOrder.length !== state.size) {
        return state; // The number of groups does not match
      }

      const newState: TOptionGroups = new Map();
      for (const groupName of newOrder) {
        if (!state.has(groupName)) {
          return state; // One of the groups does not exist
        }

        newState.set(groupName, state.get(groupName)!);
      }

      return newState;
    }

    case SecondaryGroupsActions.SetOptionGroup: {
      const { optionGroupName, options } = action.payload;

      const newState = new Map(state);
      let optionMap: TOptionMap;
      if (Array.isArray(options)) {
        optionMap = new Map(
          options.map((option) => [option.displayedName, option]),
        );
      } else {
        optionMap = new Map(options);
      }

      newState.set(optionGroupName, optionMap);
      return newState;
    }

    default:
      return state;
  }
}
