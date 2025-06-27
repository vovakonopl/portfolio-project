import React, { FC, useState } from 'react';
import { useResize } from '@/scripts/hooks/useResize';
import { TMainGroup } from '@/app/shop/upload-product/_utils/structures/option-groups';
import { Product } from '@/app/shop/upload-product/_utils/structures/product';
import OptionBox from '../secondary-group/option-box';
import MainOptionList from './main-option-list';
import { cn } from '@/lib/cn';

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

  // dropdown list for smaller screens
  // hide list on resize when it's no longer a vertical list of options
  useResize(() => {
    const windowMaxWidth: number = 640;
    const windowWidth: number = window.innerWidth;

    if (windowWidth >= windowMaxWidth) {
      setIsListOpened(false);
    }
  });

  return (
    <div
      aria-describedby="main-group-tooltip"
      className={cn(
        'box-border flex w-full cursor-default items-stretch gap-4',
        'max-sm:flex-col max-sm:gap-0 max-sm:overflow-hidden',
      )}
    >
      <div
        className={cn(
          'flex w-56 border-r-2 border-gray-400 py-2 pl-4 pr-8',
          'max-sm:w-full max-sm:border-r-0 max-sm:px-4 max-sm:py-0',
        )}
      >
        <OptionBox
          id={group.name}
          className="my-auto max-h-fit w-full bg-white"
          onClick={() => {
            if (window.screen.width <= 640) {
              setIsListOpened((state: boolean) => !state);
            }
          }}
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
        className={cn(
          'option-list-dropdown',
          isListOpened ? 'list-opened' : 'list-hide',
        )}
      />
    </div>
  );
};

export default MainOptionGroup;
