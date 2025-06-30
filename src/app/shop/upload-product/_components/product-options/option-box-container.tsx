import {
  FC,
  forwardRef,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/cn';
import { Edit, X } from 'lucide-react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSS } from '@dnd-kit/utilities';
import { useSortableOptions } from '@/app/shop/upload-product/_utils/use-sortable-options';
import RenameOption from './rename-option';
import ElementWrapper from './element-wrapper';

interface IOptionBoxContainerProps {
  id: string;
  children?: ReactNode;
  className?: string;
  disableListeners?: boolean;
  dragListeners?: SyntheticListenerMap;
  isActive?: boolean;
  isDragDisabled?: boolean;
  isListItem?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  ref?: Ref<HTMLDivElement>;
}

const OptionBoxContainer: FC<IOptionBoxContainerProps> = forwardRef(
  (
    {
      id,
      children,
      className,
      disableListeners,
      dragListeners,
      isActive,
      isDragDisabled = true,
      isListItem = false,
      onClick,
      onDelete,
      onRename,
    },
    ref,
  ) => {
    const [isRenaming, setIsRenaming] = useState<boolean>(false);

    // save the original width of the component while renaming
    const [elemWidthRem, setElemWidthRem] = useState<number>(0);
    const elementRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(
      ref,
      () => elementRef.current || ({} as HTMLDivElement),
    ); // forward same ref to parent

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

    // TODO: fix buttons in the renaming state
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

    return (
      <ElementWrapper
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
            isActive && 'border-2 border-blue-400',
            !isRenaming && 'option',
            (onDelete || onRename) &&
              !isRenaming &&
              'flex items-center justify-center px-8',
          )}
          {...(isRenaming || disableListeners ? {} : listeners)} // disable dragging while renaming
          ref={elementRef}
          onPointerUp={() => {
            if (isOver || isDragDisabled) {
              onClick?.();
            }
          }}
        >
          {/* Renaming state */}
          {isRenaming ? (
            <RenameOption
              defaultValue={id}
              elemWidthRem={elemWidthRem}
              onCancel={handleCancelRename}
              onRename={handleRename}
            />
          ) : (
            children // Default state
          )}
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
      </ElementWrapper>
    );
  },
);
OptionBoxContainer.displayName = 'OptionBoxContainer';

export default OptionBoxContainer;
