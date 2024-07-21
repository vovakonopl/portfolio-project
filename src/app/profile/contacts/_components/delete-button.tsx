import { FC } from 'react';
import Image from 'next/image';

interface IDeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: FC<IDeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex size-6 items-center justify-center transition-transform hover:scale-110 active:scale-90"
    >
      <Image
        src="/icons/delete.svg"
        alt="x"
        width={16}
        height={16}
        className="size-4"
      />
    </button>
  );
};

export default DeleteButton;
