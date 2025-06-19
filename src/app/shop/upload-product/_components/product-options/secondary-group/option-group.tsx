import React, { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import { TOptionMap } from '@/app/shop/upload-product/_utils/structures/option-groups';
import OptionBox from './option-box';
import OptionList from './option-list';

interface IOptionGroupProps {
  groupName: string;
  optionMap: TOptionMap;
  onOptionAdd: (optionGroupName: string, option: SecondaryOption) => void;
  onGroupDelete: (groupName: string) => void;
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

const OptionGroup: FC<IOptionGroupProps> = ({
  groupName,
  optionMap,
  onOptionAdd,
  onGroupDelete,
  onOptionDelete,
  onOptionReorder,
  onOptionRename,
  onGroupRename,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: groupName });

  if (transform?.scaleY) transform.scaleY = 1;
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <li
      className="box-border flex w-full cursor-default items-stretch gap-4"
      ref={setNodeRef}
      style={style}
      {...attributes}
      tabIndex={-1}
    >
      <div className="flex w-56 border-r-2 border-gray-400 py-2 pl-4 pr-8">
        <OptionBox
          id={groupName}
          className="my-auto max-h-fit w-full"
          onDelete={() => onGroupDelete(groupName)}
          onRename={
            onGroupRename &&
            ((newName: string) => onGroupRename(groupName, newName))
          }
          isDragDisabled={true}
          dragListeners={listeners}
        >
          {groupName}
        </OptionBox>
      </div>

      <OptionList
        groupName={groupName}
        isDragDisabled={isDragging}
        onOptionAdd={onOptionAdd}
        onOptionDelete={onOptionDelete}
        onReorder={onOptionReorder}
        onRename={onOptionRename}
        optionMap={optionMap}
      />
    </li>
  );
};

export default OptionGroup;
