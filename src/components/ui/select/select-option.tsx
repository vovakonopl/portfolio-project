import { FC } from 'react';

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

export const SelectOption: FC<ISelectOptionProps> = ({
  id,
  checked,
  children,
  name,
  onChange,
  onBlur,
  onKeyDown,
  value,
}) => {
  const inputId: string = id || value;

  return (
    <li>
      <input
        type="radio"
        id={inputId}
        checked={checked}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        value={value}
      />
      <label htmlFor={inputId}>{children}</label>
    </li>
  );
};

export default SelectOption;
