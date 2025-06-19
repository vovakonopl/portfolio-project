import React, { FC, useState } from 'react';
import { MAX_OPTION_NAME_LENGTH } from '@/app/shop/upload-product/_utils/constants';
import { cn } from '@/lib/cn';
import { Check, X } from 'lucide-react';

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

  return (
    <div className="flex flex-col items-center gap-2">
      <input
        className="max-w-full overflow-hidden border-b border-gray-500 bg-transparent px-2 py-1 text-center focus:outline-none"
        autoFocus
        type="text"
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onBlur={handleRename}
        maxLength={MAX_OPTION_NAME_LENGTH}
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
      />

      <div className="gap4 flex justify-evenly">
        <button
          className={cn(
            'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
            'hover:outline-gray-500 active:outline-gray-800',
          )}
          onClick={onCancel}
          type="button"
        >
          <X className="option__button-icon size-5" />
        </button>

        <button
          className={cn(
            'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
            'hover:outline-gray-500 active:outline-gray-800',
          )}
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
