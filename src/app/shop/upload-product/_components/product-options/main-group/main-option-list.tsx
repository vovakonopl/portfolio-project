import { FC } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { TMainGroup } from '@/app/shop/upload-product/_utils/structures/option-groups';
import { Product } from '@/app/shop/upload-product/_utils/structures/product';
import { reorderOptionsArray } from '@/app/shop/upload-product/_utils/reorder-options-array';
import { MAX_OPTIONS_IN_GROUP } from '@/app/shop/upload-product/_utils/constants';
import MainOptionBox from './main-option-box';

interface IMainOptionListProps {
  group: TMainGroup;
  onOptionAdd: () => void;
  onOptionDelete: (optionName: string) => void;
  onOptionRename: (optionName: string, newName: string) => void;
  onReorder: (options: string[]) => void;
}

const MainOptionList: FC<IMainOptionListProps> = ({
  group,
  onOptionAdd,
  onOptionDelete,
  onOptionRename,
  onReorder,
}) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const options: Product[] = Array.from(group.options.values());
  if (options.some((option: Product) => !option.optionName)) {
    console.error('Missed "displayedName" property.');
    return <></>;
  }

  const handleOnDragEnd = (e: DragEndEvent) => {
    const updatedOptions: Product[] | null = reorderOptionsArray<Product>(
      e,
      options,
    );

    if (updatedOptions) {
      onReorder(updatedOptions.map((option: Product) => option.optionName!));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleOnDragEnd}
      modifiers={[restrictToParentElement]}
      sensors={sensors}
    >
      <ol className="relative flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2">
        <SortableContext
          items={options.map((option) => option.optionName!)}
          strategy={rectSortingStrategy}
          disabled={options.length < 2}
        >
          {options.map((option: Product) => (
            <MainOptionBox
              id={option.optionName!}
              isDragDisabled={options.length < 2}
              onDelete={
                options.length > 1
                  ? () => onOptionDelete(option.optionName!)
                  : undefined
              }
              onRename={(newName: string) =>
                onOptionRename(option.optionName!, newName)
              }
              key={option.optionName}
            >
              {option.optionName}
            </MainOptionBox>
          ))}
        </SortableContext>

        {options.length < MAX_OPTIONS_IN_GROUP && (
          <button
            className={cn(
              '-m-2 box-content p-2 text-gray-400 transition-colors',
              'hover:text-gray-500 active:text-gray-800',
            )}
            type="button"
            onClick={onOptionAdd}
          >
            <PlusCircle className="size-6" />
          </button>
        )}
      </ol>
    </DndContext>
  );
};

export default MainOptionList;
