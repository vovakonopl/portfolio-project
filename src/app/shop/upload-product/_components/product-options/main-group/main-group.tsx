import React, { FC } from 'react';
import { TMainGroup } from '@/app/shop/upload-product/_utils/structures/option-groups';
import { Product } from '@/app/shop/upload-product/_utils/structures/product';
import OptionBox from '../secondary-group/option-box';
import MainOptionList from './main-option-list';

interface IMainOptionGroupProps {
  activeProduct: Product;
  group: TMainGroup;
  onGroupRename: (newName: string) => void;
  onOptionCreate: () => void;
  onOptionClick: (optionName: string) => void;
  onOptionDelete: (optionName: string) => void;
  onOptionRename: (optionName: string, newName: string) => void;
  onReorder: (options: string[]) => void;
}

const MainOptionGroup: FC<IMainOptionGroupProps> = ({
  activeProduct,
  group,
  onGroupRename,
  onOptionCreate,
  onOptionClick,
  onOptionDelete,
  onOptionRename,
  onReorder,
}) => {
  return (
    <div
      aria-describedby="main-group-tooltip"
      className="box-border flex w-full cursor-default items-stretch gap-4"
    >
      <div className="flex w-56 border-r-2 border-gray-400 py-2 pl-4 pr-8">
        <OptionBox
          id={group.name}
          className="my-auto max-h-fit w-full"
          isListItem={false}
          onRename={onGroupRename}
        >
          {group.name}
        </OptionBox>
      </div>

      <MainOptionList
        activeProduct={activeProduct}
        group={group}
        onOptionAdd={onOptionCreate}
        onOptionClick={onOptionClick}
        onOptionDelete={onOptionDelete}
        onOptionRename={onOptionRename}
        onReorder={onReorder}
      />
    </div>
  );
};

export default MainOptionGroup;
