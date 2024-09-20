import { cn } from '@/lib/cn';
import { FC } from 'react';

interface ITitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title: FC<ITitleProps> = ({ children, className }) => {
  return (
    <div className={cn('relative', className)}>
      <h4 className="line-h-1 ml-6 w-fit bg-white px-1 font-medium max-sm:ml-3">
        {children}
      </h4>
      <hr className="absolute inset-x-0 top-1/2 -z-10 h-px -translate-y-1/2 border-none bg-gray-400" />
    </div>
  );
};

export default Title;
