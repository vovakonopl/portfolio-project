import { FC, useRef, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, PlusCircle, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import Modal from '@/components/modal';
import InputField from '@/components/ui/text-input-field';
import OptionBox from './option-box';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import {
  optionScheme,
  TOption,
} from '@/app/shop/upload-product/_utils/option-scheme';
import { TOptionMap } from '@/app/shop/upload-product/_utils/structures/option-groups';
import {
  MAX_OPTION_NAME_LENGTH,
  MAX_OPTIONS_IN_GROUP,
} from '@/app/shop/upload-product/_utils/constants';
import { reorderOptionsArray } from '@/app/shop/upload-product/_utils/reorder-options-array';

interface IOptionListProps {
  groupName: string;
  isDragDisabled?: boolean;
  onOptionAdd: (optionGroupName: string, option: SecondaryOption) => void;
  onOptionDelete: (optionGroupName: string, optionName: string) => void;
  onReorder: (
    optionGroupName: string,
    options: SecondaryOption[] | TOptionMap,
  ) => void;
  onRename?: (
    optionGroupName: string,
    optionName: string,
    newName: string,
  ) => void;
  optionMap: TOptionMap;
}

const OptionList: FC<IOptionListProps> = ({
  groupName,
  isDragDisabled = false,
  onOptionAdd,
  onOptionDelete,
  onReorder,
  onRename,
  optionMap,
}) => {
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);
  const closeModalRef = useRef<() => void>(() => {});
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<TOption>({
    resolver: zodResolver(optionScheme),
    defaultValues: { price: 0 },
  });
  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  const options: SecondaryOption[] = Array.from(optionMap.values());
  const handleOnDragEnd = (e: DragEndEvent) => {
    const updatedOptions: SecondaryOption[] | null = reorderOptionsArray(
      e,
      options,
    );

    if (updatedOptions) {
      onReorder(groupName, updatedOptions);
    }
  };

  const handleCloseModal = () => {
    setIsActiveModal(false);
    reset();
  };

  const onSubmit = (data: TOption) => {
    const option = new SecondaryOption(
      data.displayedName,
      data.name || '',
      Math.floor((data.price || 0) * 100), // dollars to cents
    );

    onOptionAdd(groupName, option);
    handleCloseModal();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault();
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
          items={options.map((option) => option.displayedName)}
          strategy={rectSortingStrategy}
          disabled={options.length < 2}
        >
          {options.map((option: SecondaryOption) => (
            <OptionBox
              id={option.displayedName}
              isDragDisabled={isDragDisabled || options.length < 2}
              isListItem={true}
              onDelete={() => onOptionDelete(groupName, option.displayedName)}
              onRename={
                onRename &&
                ((newName: string) =>
                  onRename(groupName, option.displayedName, newName))
              }
              option={option}
              key={option.displayedName}
            >
              {option.displayedName}
            </OptionBox>
          ))}
        </SortableContext>

        {options.length < MAX_OPTIONS_IN_GROUP && (
          <button
            className={cn(
              '-m-2 box-content p-2 text-gray-400 transition-colors',
              'hover:text-gray-500 active:text-gray-800',
            )}
            type="button"
            onClick={() => setIsActiveModal(true)}
          >
            <PlusCircle className="size-6" />
          </button>
        )}

        {isActiveModal && (
          <Modal
            onClose={handleCloseModal}
            closeModalRef={closeModalRef}
            defaultStyles={{ coverSmallScreen: false }}
          >
            <h3 className="text-center text-xl font-medium">
              Add a new option
            </h3>
            <div className="my-auto flex flex-col gap-6">
              <InputField
                fullWidth
                id="displayed-name"
                label="Displayed name*"
                maxLength={MAX_OPTION_NAME_LENGTH}
                type="text"
                onKeyDown={onKeyDown}
                error={errors.displayedName}
                register={register('displayedName')}
              />
              <InputField
                fullWidth
                id="option-name"
                label="Name"
                maxLength={MAX_OPTION_NAME_LENGTH}
                type="text"
                onKeyDown={onKeyDown}
                error={errors.name}
                register={register('name')}
              />
              <InputField
                fullWidth
                id="option-price"
                label="Price"
                min={0}
                max={1000000}
                type="number"
                onKeyDown={onKeyDown}
                error={errors.price}
                register={register('price', {
                  valueAsNumber: true,
                })}
              />

              <div className="flex justify-evenly gap-4">
                <button
                  className={cn(
                    'flex items-center gap-2 rounded border border-black px-6 py-2',
                    'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
                  )}
                  type="button"
                  onClick={handleCloseModal}
                >
                  <span>Cancel</span>
                  <X className="size-4 text-red-600" />
                </button>

                <button
                  className={cn(
                    'flex items-center gap-2 rounded border border-black px-6 py-2',
                    'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
                  )}
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                >
                  <span>Confirm</span>
                  <Check className="size-4 text-green-600" />
                </button>
              </div>
            </div>
          </Modal>
        )}
      </ol>
    </DndContext>
  );
};

export default OptionList;
