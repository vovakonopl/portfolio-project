import { FC, useRef } from 'react';

export interface ISelectOptionProps {
  id?: string;
  checked?: boolean;
  children?: React.ReactNode;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (
    e: React.FocusEvent<HTMLButtonElement | HTMLInputElement, Element>,
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
}

const SelectOption: FC<ISelectOptionProps> = ({
  id,
  checked,
  children,
  name,
  onChange,
  onBlur,
  onKeyDown,
  value,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId: string = id || value;

  const handleListItemClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <li
      className="mx-2 flex cursor-pointer items-center border border-transparent border-b-gray-400 px-2 py-2 transition-all last:border-none focus-within:mx-0 focus-within:bg-black focus-within:bg-opacity-5 focus-within:px-4 hover:mx-0 hover:bg-black hover:bg-opacity-5 hover:px-4"
      onClick={handleListItemClick}
    >
      <input
        type="radio"
        id={inputId}
        checked={checked}
        className="peer mr-2 box-content flex size-fit appearance-none items-center justify-center rounded-full border-2 border-black p-px before:m-px before:block before:size-[0.625rem] before:rounded-full before:bg-transparent before:transition-colors checked:before:bg-black focus:border-blue-400 focus:outline-0"
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        ref={inputRef}
        value={value}
      />
      <label
        className="peer-checked:font-medium peer-focus:font-medium peer-focus:text-blue-400"
        htmlFor={inputId}
      >
        {children}
      </label>
    </li>
  );
};

export default SelectOption;
