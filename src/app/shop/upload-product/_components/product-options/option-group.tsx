import React, { FC } from 'react';
import OptionBox from './option-box';
import OptionList from './option-list';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface IOptionGroupProps {
  groupName: string;
  optionSet: Set<string>;
  onGroupDelete: (groupName: string) => void;
  onOptionDelete: (optionGroupName: string, optionName: string) => void;
  onOptionReorder: (
    optionGroupName: string,
    options: string[] | Set<string>,
  ) => void;
}

const OptionGroup: FC<IOptionGroupProps> = ({
  groupName,
  optionSet,
  onGroupDelete,
  onOptionDelete,
  onOptionReorder,
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
      className="box-border flex w-full items-stretch gap-4"
      ref={setNodeRef}
      style={style}
      {...attributes}
    >
      <div className="flex w-56 border-r-2 border-gray-400 py-2 pl-4 pr-8">
        <OptionBox
          id={groupName}
          className="my-auto max-h-fit w-full"
          onDelete={() => onGroupDelete(groupName)}
          onEdit={() => {}}
          isDragDisabled={true}
          dragListeners={listeners}
        >
          {groupName}
        </OptionBox>
      </div>

      <OptionList
        groupName={groupName}
        isDragDisabled={isDragging}
        onOptionDelete={onOptionDelete}
        onReorder={onOptionReorder}
        optionSet={optionSet}
      />
    </li>
  );
};

export default OptionGroup;
