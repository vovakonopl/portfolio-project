import { FC, useEffect, useRef, useState } from 'react';
import { Edit, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CSS } from '@dnd-kit/utilities';
import RenameOption from '@/app/shop/upload-product/_components/product-options/rename-option';
import { useSortableOptions } from '@/app/shop/upload-product/_components/product-options/use-sortable-options';

interface IMainOptionBoxProps {
  id: string;
  isActive: boolean;
  children?: React.ReactNode;
  className?: string;
  isDragDisabled?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
}

const MainOptionBox: FC<IMainOptionBoxProps> = ({
  id,
  isActive,
  children,
  className,
  isDragDisabled = true,
  onClick,
  onDelete,
  onRename,
}) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  // save the original width of the component while renaming
  const [elemWidthRem, setElemWidthRem] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const { attributes, isOver, listeners, setNodeRef, transform, transition } =
    useSortableOptions(id, isDragDisabled);

  // remove element stretching or squeezing
  if (transform?.scaleY) transform.scaleY = 1;
  if (transform?.scaleX) transform.scaleX = 1;
  const styles = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    // update the component's width after possible rename
    if (isRenaming) return;

    const width: number = (elementRef.current?.offsetWidth || 0) / 16;
    setElemWidthRem(width);
  }, [isRenaming]);

  // Rename state handlers
  const handleCancelRename = () => {
    setIsRenaming(false);
  };

  const handleRename = (value: string) => {
    if (!onRename) return;
    if (value.length < 1) {
      handleCancelRename();
      return;
    }

    setIsRenaming(false);
    onRename(value);
  };

  const handleClick = () => {
    if (isOver) {
      onClick();
    }
  };

  return (
    <li
      className={cn('group relative h-min touch-none select-none', className)}
      ref={setNodeRef}
      style={styles}
      {...attributes}
    >
      {/* Delete button */}
      {!isRenaming && onDelete && (
        <button
          className="option__button left-2"
          onClick={onDelete}
          type="button"
        >
          <X className="option__button-icon" />
        </button>
      )}

      {/* Draggable element */}
      <div
        className={cn(
          'word-break cursor-grab overflow-hidden break-all rounded-md border border-gray-400 px-4 py-2 text-center',
          isActive && 'border-2 border-blue-400',
          !isRenaming && 'option',
          (onDelete || onRename) &&
            !isRenaming &&
            'flex items-center justify-center px-8',
        )}
        {...(isRenaming ? {} : listeners)} // disable dragging while renaming or showing details
        ref={elementRef}
        onPointerUp={handleClick}
      >
        {/* Renaming state */}
        {isRenaming && (
          <RenameOption
            defaultValue={id}
            elemWidthRem={elemWidthRem}
            onCancel={handleCancelRename}
            onRename={handleRename}
          />
        )}

        {/* Default state */}
        {!isRenaming && children}
      </div>

      {/* Rename button */}
      {!isRenaming && onRename && (
        <button
          className="option__button right-2"
          onPointerUp={() => setIsRenaming((prevState) => !prevState)}
          type="button"
        >
          <Edit className="option__button-icon" />
        </button>
      )}
    </li>
  );
};

export default MainOptionBox;
