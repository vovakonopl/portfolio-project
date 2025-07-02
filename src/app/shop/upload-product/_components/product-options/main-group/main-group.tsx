import React, { FC, useState } from 'react';
import { cn } from '@/lib/cn';
import { TMainGroup } from '@/types/product/option-groups';
import { Product } from '@/types/product/product';
import OptionGroupContainer from '../option-group-container';
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
  const [isListOpened, setIsListOpened] = useState<boolean>(false);

  const toggleList = (state?: boolean) => {
    setIsListOpened(state ?? !isListOpened);
  };

  return (
    <OptionGroupContainer
      aria-describedby="main-group-tooltip"
      groupName={group.name}
      onGroupRename={onGroupRename}
      toggleList={toggleList}
    >
      <MainOptionList
        activeProduct={activeProduct}
        group={group}
        onOptionAdd={onOptionCreate}
        onOptionClick={onOptionClick}
        onOptionDelete={onOptionDelete}
        onOptionRename={onOptionRename}
        onReorder={onReorder}
        className={cn(
          'option-list-dropdown',
          isListOpened ? 'list-opened' : 'list-hide',
        )}
      />
    </OptionGroupContainer>
  );
};

export default MainOptionGroup;
