import { cn } from '@/lib/cn';
import { FC } from 'react';

interface ITitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title: FC<ITitleProps> = ({ children, className }) => {
  return (
    <h4 className={cn('mr-2 not-italic text-gray-400', className)}>
      {children}
    </h4>
  );
};

export default Title;
