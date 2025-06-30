import React, { FC, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/cn';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import { TOptionMap } from '@/app/shop/upload-product/_utils/structures/option-groups';
import OptionGroupContainer from '../option-group-container';
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
  onOptionRename: (
    optionGroupName: string,
    optionName: string,
    newName: string,
  ) => void;
  onGroupRename: (groupName: string, newName: string) => void;
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
  const [isListOpened, setIsListOpened] = useState<boolean>(false);
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

  const toggleList = (state?: boolean) => {
    setIsListOpened(state ?? !isListOpened);
  };

  return (
    <OptionGroupContainer
      {...attributes}
      dragListeners={listeners}
      groupName={groupName}
      isListItem={true}
      onGroupDelete={() => onGroupDelete(groupName)}
      onGroupRename={(newName: string) => onGroupRename?.(groupName, newName)}
      ref={setNodeRef}
      style={style}
      tabIndex={-1}
      toggleList={toggleList}
    >
      <OptionList
        groupName={groupName}
        isDragDisabled={isDragging}
        onOptionAdd={onOptionAdd}
        onOptionDelete={onOptionDelete}
        onReorder={onOptionReorder}
        onRename={onOptionRename}
        optionMap={optionMap}
        className={cn(
          'option-list-dropdown',
          isListOpened && !isDragging ? 'list-opened' : 'list-hide',
        )}
      />
    </OptionGroupContainer>
  );
};

export default OptionGroup;
