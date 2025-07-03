import { FC, HTMLAttributes, KeyboardEvent, useRef, useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { TOptionMap } from '@/types/product/option-groups';
import Modal from '@/components/modal';
import InputField from '@/components/ui/text-input-field';
import { SecondaryOption } from '@/types/product/secondary-option';
import {
  optionScheme,
  TOption,
} from '@/scripts/validation-schemes/product-upload/option-scheme';
import { reorderArray } from '@/app/shop/upload-product/_utils/reorder-array';
import ModalButtons from '@/app/shop/upload-product/_components/modal-buttons';
import OptionListContainer from '../option-list-container';
import OptionBox from './option-box';

interface IOptionListProps extends HTMLAttributes<HTMLOListElement> {
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
  ...props
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
  const options: SecondaryOption[] = Array.from(optionMap.values());
  const handleDragEnd = (e: DragEndEvent) => {
    const updatedOptions: SecondaryOption[] | null = reorderArray(
      e,
      options,
      'displayedName',
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
      data.price || 0,
    );

    onOptionAdd(groupName, option);
    closeModalRef.current();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key == 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <OptionListContainer
      {...props}
      handleDragEnd={handleDragEnd}
      itemsCount={options.length}
      onOptionAdd={() => setIsActiveModal(true)}
    >
      <SortableContext
        items={options.map((option) => option.displayedName)}
        strategy={rectSortingStrategy}
        disabled={options.length < 2}
      >
        {options.map((option: SecondaryOption) => (
          <OptionBox
            id={option.displayedName}
            className="max-sm:w-full"
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

      {isActiveModal && (
        <Modal
          onClose={handleCloseModal}
          closeModalRef={closeModalRef}
          defaultStyles={{ coverSmallScreen: false }}
        >
          <h3 className="text-center text-xl font-medium">Add a new option</h3>
          <div className="my-auto flex flex-col gap-6">
            <InputField
              id="displayed-name"
              error={errors.displayedName}
              fullWidth
              label="Displayed name*"
              maxLength={PRODUCT_FIELDS_LIMITS.option.nameLength}
              onKeyDown={onKeyDown}
              register={register('displayedName')}
              type="text"
            />
            <InputField
              id="option-name"
              error={errors.name}
              fullWidth
              label="Name"
              maxLength={PRODUCT_FIELDS_LIMITS.option.nameLength}
              onKeyDown={onKeyDown}
              register={register('name')}
              type="text"
            />
            <InputField
              id="option-price"
              error={errors.price}
              fullWidth
              label="Price"
              max={PRODUCT_FIELDS_LIMITS.maxPrice}
              min={0}
              onKeyDown={onKeyDown}
              register={register('price', {
                valueAsNumber: true,
              })}
              type="number"
            />

            <ModalButtons
              handleCancel={handleCloseModal}
              handleConfirm={handleSubmit(onSubmit)}
            />
          </div>
        </Modal>
      )}
    </OptionListContainer>
  );
};

export default OptionList;
