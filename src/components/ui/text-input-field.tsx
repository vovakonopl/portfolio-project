import { cn } from '@/lib/cn';
import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type InputComponents = 'input' | 'textarea';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  component?: 'input';
};
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  component: 'textarea';
};

type InputFieldProps<T extends InputComponents> = {
  id: string;
  component?: T;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  error?: FieldError;
  fullHeight?: boolean;
  fullWidth?: boolean;
  label: string;
  register?: UseFormRegisterReturn;
} & (T extends 'textarea' ? TextareaProps : InputProps); // use props depending on value of 'component'

function InputField<T extends InputComponents>({
  id,
  component = 'input' as T,
  containerProps,
  error,
  fullHeight,
  fullWidth,
  label,
  register,
  ...props
}: InputFieldProps<T>) {
  const fieldClassName: string = cn(
    'field min-h-12 max-w-96 rounded border border-gray-400 px-4 py-2 outline-none outline-1 outline-offset-0 transition-all placeholder:select-none placeholder:text-transparent focus:border-blue-400 focus:outline-blue-400 focus:placeholder:text-gray-400',
    fullHeight && 'h-full',
    fullWidth && 'w-full max-w-full',
    error && 'border-rose-700 outline-rose-700',
    props.className,
  );
  return (
    <div
      {...containerProps}
      className={cn(
        'field-container relative mt-2 flex flex-col',
        fullHeight && 'h-full',
        fullWidth && 'w-full',
        containerProps?.className,
      )}
    >
      {component === 'input' && (
        <input
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          {...register}
          id={id}
          className={fieldClassName}
          placeholder={props.placeholder || ''}
        />
      )}
      {component === 'textarea' && (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...register}
          id={id}
          className={cn(fieldClassName, 'resize-none')}
          placeholder={props.placeholder || ''}
        />
      )}

      <label
        htmlFor={id}
        className={cn(
          'absolute left-4 top-4 cursor-text select-none border-b-white bg-transparent px-1 text-gray-400 transition-all',
          error && 'text-rose-700',
        )}
      >
        {label}
      </label>

      {error && (
        <p className="mt-1 px-3 text-sm text-rose-700">{error.message}</p>
      )}
    </div>
  );
}

export default InputField;
