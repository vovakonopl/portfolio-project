import { FC } from 'react';
import Delete from '@/assets/icons/delete.svg';

interface IDeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: FC<IDeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex size-6 items-center justify-center transition-transform hover:scale-110 active:scale-90"
    >
      <Delete className="size-4" />
    </button>
  );
};

export default DeleteButton;
