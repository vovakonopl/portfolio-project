import { FC, HTMLAttributes } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { TMainGroup } from '@/app/shop/upload-product/_utils/structures/option-groups';
import { Product } from '@/app/shop/upload-product/_utils/structures/product';
import { reorderArray } from '@/app/shop/upload-product/_utils/reorder-array';
import OptionListContainer from '../option-list-container';
import MainOptionBox from './main-option-box';

interface IMainOptionListProps extends HTMLAttributes<HTMLOListElement> {
  activeProduct: Product;
  group: TMainGroup;
  onOptionAdd: () => void;
  onOptionClick: (optionName: string) => void;
  onOptionDelete: (optionName: string) => void;
  onOptionRename: (optionName: string, newName: string) => void;
  onReorder: (options: string[]) => void;
}

const MainOptionList: FC<IMainOptionListProps> = ({
  activeProduct,
  group,
  onOptionAdd,
  onOptionClick,
  onOptionDelete,
  onOptionRename,
  onReorder,
  ...props
}) => {
  const options: Product[] = Array.from(group.options.values());
  const handleDragEnd = (e: DragEndEvent) => {
    const updatedOptions: Product[] | null = reorderArray(
      e,
      options,
      'optionName',
    );

    if (updatedOptions) {
      onReorder(updatedOptions.map((option: Product) => option.optionName));
    }
  };

  return (
    <OptionListContainer
      {...props}
      handleDragEnd={handleDragEnd}
      itemsCount={options.length}
      onOptionAdd={onOptionAdd}
    >
      <SortableContext
        items={options.map((option) => option.optionName)}
        strategy={rectSortingStrategy}
        disabled={options.length < 2}
      >
        {options.map((option: Product) => (
          <MainOptionBox
            id={option.optionName!}
            className="max-sm:w-full"
            isActive={option.optionName === activeProduct.optionName}
            isDragDisabled={options.length < 2}
            onClick={() => onOptionClick(option.optionName)}
            onDelete={
              options.length > 1
                ? () => onOptionDelete(option.optionName)
                : undefined
            }
            onRename={(newName: string) =>
              onOptionRename(option.optionName, newName)
            }
            key={option.optionName}
          >
            {option.optionName}
          </MainOptionBox>
        ))}
      </SortableContext>
    </OptionListContainer>
  );
};

export default MainOptionList;
