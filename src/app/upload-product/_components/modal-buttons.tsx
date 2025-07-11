import { FC } from 'react';
import { cn } from '@/lib/cn';
import { Check, X } from 'lucide-react';

interface IModalButtonsProps {
  className?: string;
  handleCancel: () => void;
  handleConfirm: () => void;
}

const ModalButtons: FC<IModalButtonsProps> = ({
  className,
  handleCancel,
  handleConfirm,
}) => {
  return (
    <div className={cn('flex justify-evenly gap-4', className)}>
      <button
        className={cn(
          'flex items-center gap-2 rounded border border-black px-6 py-2',
          'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
        )}
        type="button"
        onClick={handleCancel}
      >
        <span>Cancel</span>
        <X className="size-4 text-red-600" />
      </button>

      <button
        className={cn(
          'flex items-center gap-2 rounded border border-black px-6 py-2',
          'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
        )}
        type="button"
        onClick={handleConfirm}
      >
        <span>Confirm</span>
        <Check className="size-4 text-green-600" />
      </button>
    </div>
  );
};

export default ModalButtons;
