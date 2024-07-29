import { cn } from '@/scripts/classname';
import { FC } from 'react';
import Edit from '@/assets/icons/edit.svg';

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
      {iconLeft && (
        <span className="opacity-40">
          <Edit className="size-3" />
        </span>
      )}

      {children}

      {!iconLeft && (
        <span className="opacity-40">
          <Edit className="size-3" />
        </span>
      )}
    </button>
  );
};

export default EditButton;
