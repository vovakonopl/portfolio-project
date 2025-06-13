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
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import OptionBox from './option-box';
import { restrictToParentElement } from '@dnd-kit/modifiers';

interface IOptionListProps {
  groupName: string;
  isDragDisabled?: boolean;
  onReorder: (optionGroupName: string, options: string[] | Set<string>) => void;
  onOptionDelete: (optionGroupName: string, optionName: string) => void;
  optionSet: Set<string>;
}

const OptionList: FC<IOptionListProps> = ({
  groupName,
  isDragDisabled = false,
  onOptionDelete,
  onReorder,
  optionSet,
}) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const options: string[] = Array.from(optionSet);
  const handleOnDragEnd = (optionGroupName: string, e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    if (active.id === over?.id) return;

    const oldIdx: number = options.indexOf(active.id as string);
    const newIdx: number = options.indexOf(over?.id as string);
    const updatedOptions: string[] = arrayMove(options, oldIdx, newIdx);
    onReorder(optionGroupName, updatedOptions);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={(e: DragEndEvent) => {
        handleOnDragEnd(groupName, e);
      }}
      modifiers={[restrictToParentElement]}
      sensors={sensors}
    >
      <ol className="relative flex flex-1 flex-wrap gap-x-4 gap-y-2 overflow-hidden px-4 py-2">
        <SortableContext
          items={options}
          strategy={rectSortingStrategy}
          disabled={options.length < 2}
        >
          {options.map((option) => (
            <OptionBox
              id={option}
              isDragDisabled={isDragDisabled}
              isListItem={true}
              onDelete={() => onOptionDelete(groupName, option)}
              key={option}
            >
              {option}
            </OptionBox>
          ))}
        </SortableContext>
      </ol>
    </DndContext>
  );
};

export default OptionList;
