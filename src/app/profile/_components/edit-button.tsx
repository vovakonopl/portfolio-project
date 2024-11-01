import { cn } from '@/lib/cn';
import { FC } from 'react';
import { SquarePen } from 'lucide-react';

const Pen = () => {
  return (
    <span className="opacity-40">
      <SquarePen className="size-3 text-gray-700" />
    </span>
  );
};

interface IEditButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  iconLeft?: boolean;
}

const EditButton: FC<IEditButtonProps> = ({
  onClick,
  children,
  className,
  iconLeft,
}) => {
  return (
    <button
      className={cn(
        'flex items-start gap-1 capitalize underline-offset-2 hover:underline active:opacity-60',
        className,
      )}
      onClick={onClick}
    >
      {iconLeft && <Pen />}

      {children}

      {!iconLeft && <Pen />}
    </button>
  );
};

export default EditButton;
