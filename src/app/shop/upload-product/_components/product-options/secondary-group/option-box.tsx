import {
  FC,
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Edit, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import OptionDetails from '../option-details';
import RenameOption from '../rename-option';
import { useSortableOptions } from '../use-sortable-options';

type TContainerProps = (
  | HTMLAttributes<HTMLDivElement>
  | HTMLAttributes<HTMLLIElement>
) & { isListItem: boolean };
const OptionBoxContainer = forwardRef<HTMLElement, TContainerProps>(
  ({ children, isListItem, ...props }, ref) => {
    if (isListItem) {
      return (
        <li
          ref={ref as React.Ref<HTMLLIElement>}
          {...(props as HTMLAttributes<HTMLLIElement>)}
        >
          {children}
        </li>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);
OptionBoxContainer.displayName = 'OptionBoxContainer';

interface IOptionBoxProps {
  id: string;
  children?: React.ReactNode;
  className?: string;
  dragListeners?: SyntheticListenerMap;
  isDragDisabled?: boolean;
  isListItem?: boolean;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  option?: SecondaryOption;
}

const OptionBox: FC<IOptionBoxProps> = ({
  id,
  children,
  className,
  dragListeners,
  isDragDisabled = true,
  isListItem = false,
  onDelete,
  onRename,
  option,
}) => {
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  // save the original width of the component while renaming
  const [elemWidthRem, setElemWidthRem] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const { attributes, isOver, listeners, setNodeRef, transform, transition } =
    useSortableOptions(id, isDragDisabled, dragListeners);

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

  // details handlers
  const handleShowDetails = () => {
    if (!option) return;

    if (isOver || isDragDisabled) {
      setIsDetailsVisible(true);
    }
  };

  const handleHideDetails = useCallback(
    (event: MouseEvent) => {
      if (!option) return;

      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsDetailsVisible(false);
      }
    },
    [option],
  );

  useEffect(() => {
    if (!option) return;

    document.addEventListener('pointerdown', handleHideDetails);
    return () => {
      document.removeEventListener('pointerdown', handleHideDetails);
    };
  }, [option, handleHideDetails]);

  return (
    <OptionBoxContainer
      className={cn('group relative h-min touch-none select-none', className)}
      isListItem={isListItem}
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
          !isRenaming && 'option',
          (onDelete || onRename) &&
            !isRenaming &&
            'flex items-center justify-center px-8',
        )}
        {...(isRenaming || isDetailsVisible ? {} : listeners)} // disable dragging while renaming or showing details
        ref={elementRef}
        onPointerUp={handleShowDetails}
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

        {/* Detailed info on hover, while not dragged */}
        {option && isDetailsVisible && <OptionDetails option={option} />}
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
    </OptionBoxContainer>
  );
};

export default OptionBox;
