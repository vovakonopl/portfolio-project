import React, { FC } from 'react';
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
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TOptionGroups } from '@/app/shop/upload-product/_reducers/option-groups-reducer';
import OptionGroup from './option-group';
import { restrictToParentElement } from '@dnd-kit/modifiers';

interface IGroupListProps {
  optionGroups: TOptionGroups;
  onGroupDelete: (groupName: string) => void;
  onGroupReorder: (newGroupOrder: string[]) => void;
  onOptionDelete: (optionGroupName: string, optionName: string) => void;
  onOptionReorder: (
    optionGroupName: string,
    options: string[] | Set<string>,
  ) => void;
  onOptionRename?: (
    optionGroupName: string,
    optionName: string,
    newName: string,
  ) => void;
  onGroupRename?: (groupName: string, newName: string) => void;
}

const GroupList: FC<IGroupListProps> = ({
  optionGroups,
  onGroupDelete,
  onGroupReorder,
  onOptionDelete,
  onOptionReorder,
  onOptionRename,
  onGroupRename,
}) => {
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const groups: string[] = Array.from(optionGroups.keys());

  const handleOnDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    if (active.id === over?.id) return;

    const oldIdx: number = groups.indexOf(active.id as string);
    const newIdx: number = groups.indexOf(over?.id as string);
    const updatedOrder: string[] = arrayMove(groups, oldIdx, newIdx);
    onGroupReorder(updatedOrder);
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleOnDragEnd}
      modifiers={[restrictToParentElement]}
      sensors={sensors}
    >
      <ol className="relative flex flex-col gap-4 overflow-hidden">
        <SortableContext
          items={groups}
          strategy={verticalListSortingStrategy}
          disabled={optionGroups.size < 2}
        >
          {Array.from(optionGroups.entries()).map(
            ([groupName, optionSet]: [string, Set<string>]) => (
              <OptionGroup
                groupName={groupName}
                optionSet={optionSet}
                onGroupDelete={onGroupDelete}
                onOptionDelete={onOptionDelete}
                onOptionReorder={onOptionReorder}
                onOptionRename={onOptionRename}
                onGroupRename={onGroupRename}
                key={groupName}
              />
            ),
          )}
        </SortableContext>
      </ol>
    </DndContext>
  );
};

export default GroupList;
