import { FC } from 'react';
import { Trash2 } from 'lucide-react';

interface IDeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: FC<IDeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex size-6 items-center justify-center transition-transform hover:scale-110 active:scale-90"
    >
      <Trash2 className="size-4 text-rose-500" />
    </button>
  );
};

export default DeleteButton;
