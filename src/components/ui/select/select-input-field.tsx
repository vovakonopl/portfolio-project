import { FC, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ISelectInputFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const SelectInputField: FC<ISelectInputFieldProps> = (props) => {
  return (
    <li
      className={cn(
        'relative mx-2 flex items-center border border-transparent border-b-gray-400 px-1 py-1 transition-all',
        'after:absolute after:inset-x-1/2 after:bottom-0 after:z-20 after:h-[2px] after:bg-gray-400 after:transition-all',
        'last:border-none focus-within:after:inset-x-0 hover:after:inset-x-0 hover:after:h-px focus-within:hover:after:h-[2px]',
      )}
    >
      <input
        {...props}
        type="text"
        className={cn(
          'w-full rounded px-2 py-1 focus:outline-0',
          props.className,
        )}
      />
    </li>
  );
};

export default SelectInputField;
