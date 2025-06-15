type TOptionNames = Set<string>;
export type TOptionGroups = Map<string, TOptionNames>;

export enum OptionGroupsActions {
  AddOptionGroup,
  RemoveOptionGroup,
  RenameOptionGroup,
  AddOption,
  RemoveOption,
  RenameOption,
  ReorderOptionGroups,
  SetOptionGroup,
}

type TAction =
  | {
      type:
        | OptionGroupsActions.AddOptionGroup
        | OptionGroupsActions.RemoveOptionGroup;
      payload: { optionGroupName: string };
    }
  | {
      type: OptionGroupsActions.AddOption | OptionGroupsActions.RemoveOption;
      payload: { optionGroupName: string; optionName: string };
    }
  | {
      type: OptionGroupsActions.RenameOptionGroup;
      payload: { optionGroupName: string; newName: string };
    }
  | {
      type: OptionGroupsActions.RenameOption;
      payload: { optionGroupName: string; option: string; newName: string };
    }
  | {
      type: OptionGroupsActions.ReorderOptionGroups;
      payload: { newOrder: string[] };
    }
  | {
      type: OptionGroupsActions.SetOptionGroup;
      payload: { optionGroupName: string; options: string[] | Set<string> };
    };

export function optionGroupReducer(state: TOptionGroups, action: TAction) {
  switch (action.type) {
    case OptionGroupsActions.AddOptionGroup: {
      const { optionGroupName } = action.payload;
      if (state.has(optionGroupName)) {
        return state; // Option group already exists
      }

      const newState = new Map(state);
      newState.set(optionGroupName, new Set());
      return newState;
    }

    case OptionGroupsActions.RemoveOptionGroup: {
      const { optionGroupName } = action.payload;
      if (!state.has(optionGroupName)) {
        return state; // Option group does not exist
      }

      const newState = new Map(state);
      newState.delete(optionGroupName);
      return newState;
    }

    case OptionGroupsActions.RenameOptionGroup: {
      const { optionGroupName, newName } = action.payload;
      if (!state.has(optionGroupName) || state.has(newName)) {
        return state; // Option group does not exist or new name already exists
      }

      type TEntry = [string, TOptionNames];
      const entries = state
        .entries()
        .map(([groupName, optionSet]: TEntry): TEntry => {
          const newOptionSet: TOptionNames = new Set(optionSet);
          if (groupName === optionGroupName) return [newName, newOptionSet];
          return [groupName, newOptionSet];
        });

      return new Map(entries);
    }

    case OptionGroupsActions.AddOption: {
      const { optionGroupName, optionName } = action.payload;
      if (!state.has(optionGroupName)) {
        return state; // Option group does not exist
      }
      if (state.get(optionGroupName)!.has(optionName)) {
        return state; // Option already exists in the group
      }

      const newState = new Map(state);
      const options = newState.get(optionGroupName)!;
      options.add(optionName);
      newState.set(optionGroupName, new Set(options));

      return newState;
    }

    case OptionGroupsActions.RemoveOption: {
      const { optionGroupName, optionName } = action.payload;
      if (!state.get(optionGroupName)?.has(optionName)) {
        return state; // Option group or option does not exist in the group
      }

      const newState = new Map(state);
      const options = new Set(newState.get(optionGroupName));
      options.delete(optionName);
      newState.set(optionGroupName, options);

      return newState;
    }

    case OptionGroupsActions.RenameOption: {
      const { optionGroupName, option, newName } = action.payload;
      if (!state.has(optionGroupName)) {
        return state; // Option group does not exist
      }

      const optionSet = state.get(optionGroupName);
      if (!optionSet || !optionSet.has(option) || optionSet.has(newName)) {
        return state; // Option does not exist in the group or new name already exists
      }

      let options: string[] = Array.from(optionSet);
      options = options.map((opt) => (opt === option ? newName : opt));
      const newState = new Map(state);
      newState.set(optionGroupName, new Set(options));

      return newState;
    }

    case OptionGroupsActions.ReorderOptionGroups: {
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

    case OptionGroupsActions.SetOptionGroup: {
      const { optionGroupName, options } = action.payload;

      const newState = new Map(state);
      const optionSet = new Set(options);
      newState.set(optionGroupName, optionSet);

      return newState;
    }

    default:
      return state;
  }
}
