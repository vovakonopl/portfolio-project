import { ActionDispatch, FC } from 'react';
import { CircleHelp } from 'lucide-react';
import { SecondaryOption } from '@/types/product/secondary-option';
import {
  TMainGroup,
  TOptionGroups,
  TOptionMap,
} from '@/types/product/option-groups';
import { Product } from '@/types/product/product';
import Tooltip from '@/components/ui/tooltip';
import Title from '@/app/shop/upload-product/_components/form-title';
import MainOptionGroup from './product-options/main-group/main-group';
import GroupList from './product-options/secondary-group/group-list';
import {
  MainGroupActions,
  TAction as TMainGroupAction,
} from '../_reducers/option-groups/main-group-reducer';
import {
  SecondaryGroupsActions,
  TAction as TSecondaryGroupAction,
} from '../_reducers/option-groups/secondary-groups-reducer';

interface GroupsProps {
  activeProduct: Product;
  dispatchMainGroup: ActionDispatch<[action: TMainGroupAction]>;
  dispatchSecondaryGroups: ActionDispatch<[action: TSecondaryGroupAction]>;
  mainGroup: TMainGroup;
  onMainOptionClick: (optionName: string) => void;
  onMainOptionCreate: () => void;
  onMainOptionDelete: (optionName: string) => void;
  secondaryGroups: TOptionGroups;
}

const Groups: FC<GroupsProps> = ({
  activeProduct,
  dispatchMainGroup,
  dispatchSecondaryGroups,
  mainGroup,
  onMainOptionClick,
  onMainOptionCreate,
  onMainOptionDelete,
  secondaryGroups,
}) => {
  // =-=-=-=-=-=-=-=-=-=-= Main group handlers =-=-=-=-=-=-=-=-=-=-=
  const onMainGroupRename = (newName: string) => {
    dispatchMainGroup({
      type: MainGroupActions.RenameOptionGroup,
      payload: { newName },
    });
  };

  const onMainOptionRename = (optionName: string, newName: string) => {
    dispatchMainGroup({
      type: MainGroupActions.RenameOption,
      payload: { optionName, newName },
    });
  };

  const onMainGroupReorder = (newOrder: string[]) => {
    dispatchMainGroup({
      type: MainGroupActions.ReorderOptionGroups,
      payload: { newOrder },
    });
  };

  // =-=-=-=-=-=-=-=-=-=-= Secondary groups handlers =-=-=-=-=-=-=-=-=-=-=
  const onSecondaryGroupAdd = (optionGroupName: string): void => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.AddOptionGroup,
      payload: { optionGroupName },
    });
  };

  const onSecondaryOptionAdd = (
    optionGroupName: string,
    option: SecondaryOption,
  ): void => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.AddOption,
      payload: { optionGroupName, option },
    });
  };

  const onSecondaryGroupReorder = (newOrder: string[]) => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.ReorderOptionGroups,
      payload: { newOrder },
    });
  };

  const onSecondaryGroupDelete = (optionGroupName: string) => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.RemoveOptionGroup,
      payload: { optionGroupName },
    });
  };

  const onSecondaryOptionReorder = (
    optionGroupName: string,
    options: SecondaryOption[] | TOptionMap,
  ) => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.SetOptionGroup,
      payload: { optionGroupName, options },
    });
  };

  const onSecondaryOptionDelete = (
    optionGroupName: string,
    optionName: string,
  ) => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.RemoveOption,
      payload: { optionGroupName, optionName },
    });
  };

  const onSecondaryOptionRename = (
    optionGroupName: string,
    optionName: string,
    newName: string,
  ) => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.RenameOption,
      payload: { optionGroupName, optionName, newName },
    });
  };

  const onSecondaryGroupRename = (optionGroupName: string, newName: string) => {
    dispatchSecondaryGroups({
      type: SecondaryGroupsActions.RenameOptionGroup,
      payload: { optionGroupName, newName },
    });
  };

  return (
    <div>
      <Title className="mb-2">Option groups</Title>
      <div className="flex flex-col gap-6 px-4 max-sm:px-2">
        <div>
          <h5 className="mb-2 ml-3 text-sm font-medium max-sm:ml-2">
            Main group
            <Tooltip
              className="inline text-sm"
              tooltipId="main-group-tooltip"
              tooltip={`Only variants in main group can have different images and description.
                Other groups can only add text to name or increase price (both will be calculated as sum of all selected variants).`}
            >
              <CircleHelp className="inline h-4 cursor-pointer text-gray-400" />
            </Tooltip>
          </h5>
          <MainOptionGroup
            activeProduct={activeProduct}
            group={mainGroup}
            onGroupRename={onMainGroupRename}
            onOptionCreate={onMainOptionCreate}
            onOptionDelete={onMainOptionDelete}
            onOptionRename={onMainOptionRename}
            onOptionClick={onMainOptionClick}
            onReorder={onMainGroupReorder}
          />
        </div>

        <div>
          <h5 className="mb-2 ml-3 text-sm font-medium max-sm:ml-2">
            Secondary groups
          </h5>
          <GroupList
            optionGroups={secondaryGroups}
            onGroupAdd={onSecondaryGroupAdd}
            onOptionAdd={onSecondaryOptionAdd}
            onGroupReorder={onSecondaryGroupReorder}
            onGroupDelete={onSecondaryGroupDelete}
            onOptionReorder={onSecondaryOptionReorder}
            onOptionDelete={onSecondaryOptionDelete}
            onOptionRename={onSecondaryOptionRename}
            onGroupRename={onSecondaryGroupRename}
          />
        </div>
      </div>
    </div>
  );
};

export default Groups;
