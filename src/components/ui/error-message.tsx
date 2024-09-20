import { FC } from 'react';
import { cn } from '@/lib/cn';

interface IErrorProps extends React.HTMLProps<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const Error: FC<IErrorProps> = ({ children, className, ...props }) => {
  return (
    <p {...props} className={cn('text-sm text-rose-700', className)}>
      {children}
    </p>
  );
};

export default Error;
