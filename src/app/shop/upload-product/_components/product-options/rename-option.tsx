import React, { FC, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';
import { PRODUCT_FIELDS_LIMITS } from '@/constants/product/product-fields-limits';
import { cn } from '@/lib/cn';

interface IRenameOptionProps {
  defaultValue: string;
  elemWidthRem: number;
  onCancel: () => void;
  onRename: (value: string) => void;
}

const RenameOption: FC<IRenameOptionProps> = ({
  defaultValue,
  elemWidthRem,
  onCancel,
  onRename,
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue);
  // fix firing onBlur handler when clicked on buttons within component
  const ignoreBlurRef = useRef(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onRename(inputValue);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleRename = () => onRename(inputValue);

  const handlePointerDown = () => {
    ignoreBlurRef.current = true;
  };

  const handleBlur = () => {
    if (!ignoreBlurRef.current) {
      handleRename();
    }

    ignoreBlurRef.current = false;
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        autoFocus
        className="max-w-full overflow-hidden border-b border-gray-500 bg-transparent px-2 py-1 text-center focus:outline-none"
        onBlur={handleBlur}
        onChange={onChange}
        onKeyDown={onKeyDown}
        maxLength={PRODUCT_FIELDS_LIMITS.option.nameLength}
        style={{
          width:
            'max(' +
            (elemWidthRem - 2) + // side paddings, 1rem each
            'rem, ' +
            defaultValue.length * 1.4 +
            'ch)',
          // ch unit takes width of '0' char.
          // 'm' char is much longer, so length is multiplied by 1.4 to fit all chars,
          // but it makes input longer than its content.
        }}
        type="text"
        value={inputValue}
      />

      <div className="gap4 flex justify-evenly">
        <button
          className={cn(
            'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
            'hover:outline-gray-500 active:outline-gray-800',
          )}
          onClick={onCancel}
          onPointerDown={handlePointerDown}
          type="button"
        >
          <X className="option__button-icon size-5" />
        </button>

        <button
          className={cn(
            'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
            'hover:outline-gray-500 active:outline-gray-800',
          )}
          onPointerDown={handlePointerDown}
          onClick={handleRename}
          type="button"
        >
          <Check className="option__button-icon size-5" />
        </button>
      </div>
    </div>
  );
};

export default RenameOption;
