import Image from 'next/image';
import { FC } from 'react';

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
      className={`flex items-start gap-1 capitalize underline-offset-2 hover:underline active:opacity-60 ${className || ''}`.trimEnd()}
      onClick={onClick}
    >
      {iconLeft && (
        <span className="opacity-40">
          <Image src={'/icons/edit.svg'} alt="" height={12} width={12} />
        </span>
      )}

      {children}

      {!iconLeft && (
        <span className="opacity-40">
          <Image src={'/icons/edit.svg'} alt="" height={12} width={12} />
        </span>
      )}
    </button>
  );
};

export default EditButton;
