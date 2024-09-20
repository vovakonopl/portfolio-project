import { FC } from 'react';
import { cn } from '@/lib/cn';
import { FieldError } from 'react-hook-form';

interface ILabelProps extends React.HTMLProps<HTMLLabelElement> {
  children?: React.ReactNode;
  error?: FieldError;
  htmlFor: string;
}

const Label: FC<ILabelProps> = ({ children, className, error, ...props }) => {
  return (
    <label
      {...props}
      className={cn(
        'absolute left-4 top-4 select-none border-b-white bg-transparent px-1 text-gray-400 transition-all',
        error && 'text-rose-700',
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;
