import React, { FC, useRef, useState } from 'react';
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
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { Check, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import Modal from '@/components/modal';
import InputField from '@/components/ui/text-input-field';
import OptionGroup from './option-group';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import {
  TOptionGroups,
  TOptionMap,
} from '@/app/shop/upload-product/_utils/structures/option-groups';
import { MAX_SECONDARY_GROUPS } from '@/app/shop/upload-product/_utils/constants';
import ModalButtons from '@/app/shop/upload-product/_components/modal-buttons';

interface IGroupListProps {
  optionGroups: TOptionGroups;
  onGroupAdd: (optionGroupName: string) => void;
  onOptionAdd: (optionGroupName: string, option: SecondaryOption) => void;
  onGroupDelete: (optionGroupName: string) => void;
  onGroupReorder: (newGroupOrder: string[]) => void;
  onOptionDelete: (optionGroupName: string, optionName: string) => void;
  onOptionReorder: (
    optionGroupName: string,
    options: SecondaryOption[] | TOptionMap,
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
  onGroupAdd,
  onOptionAdd,
  onGroupDelete,
  onGroupReorder,
  onOptionDelete,
  onOptionReorder,
  onOptionRename,
  onGroupRename,
}) => {
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');
  const closeModalRef = useRef<() => void>(() => {});
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

  const handleCloseModal = () => {
    setIsActiveModal(false);
    setInputValue('');
  };

  const handleConfirm = () => {
    onGroupAdd(inputValue);
    closeModalRef.current();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault();
      handleConfirm();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleOnDragEnd}
        modifiers={[restrictToParentElement]}
        sensors={sensors}
      >
        <ol className="relative flex flex-col gap-4">
          <SortableContext
            items={groups}
            strategy={verticalListSortingStrategy}
            disabled={optionGroups.size < 2}
          >
            {Array.from(optionGroups.entries()).map(
              ([groupName, optionMap]: [string, TOptionMap]) => (
                <OptionGroup
                  groupName={groupName}
                  optionMap={optionMap}
                  onOptionAdd={onOptionAdd}
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

      {optionGroups.size < MAX_SECONDARY_GROUPS && (
        <button
          className={cn(
            'ml-4 flex w-fit items-center gap-2 rounded border border-black px-4 py-2 transition-colors',
            'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
          )}
          onClick={() => setIsActiveModal(true)}
          type="button"
        >
          <span>Add new group</span>
          <PlusCircle className="size-5" />
        </button>
      )}

      {isActiveModal && (
        <Modal
          onClose={handleCloseModal}
          closeModalRef={closeModalRef}
          defaultStyles={{ coverSmallScreen: false }}
        >
          <h3 className="text-center text-xl font-medium">
            Add new option group
          </h3>
          <div className="my-auto flex flex-col gap-6">
            <InputField
              fullWidth
              id="option-name"
              label="Option name"
              type="text"
              onChange={onChange}
              onKeyDown={onKeyDown}
              value={inputValue}
            />

            <ModalButtons
              handleCancel={handleCloseModal}
              handleConfirm={handleConfirm}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupList;
