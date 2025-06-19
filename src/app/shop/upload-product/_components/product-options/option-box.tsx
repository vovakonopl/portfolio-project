import {
  FC,
  forwardRef,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Check, Edit, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import { MAX_OPTION_NAME_LENGTH } from '@/app/shop/upload-product/_utils/constants';
import OptionDetails from './option-details';

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
  isDragDisabled = false,
  isListItem = false,
  onDelete,
  onRename,
  option,
}) => {
  const disabledSortableOptions = {
    attributes: {},
    listeners: dragListeners,
    setNodeRef: undefined,
    transform: null,
    transition: undefined,
  };
  const [isRenaming, setIsRenaming] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(id);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  // save the original width of the component while renaming
  const [elemWidthRem, setElemWidthRem] = useState<number>(0);
  const elementRef = useRef<HTMLDivElement>(null);

  const sortable = useSortable({ id });
  const { attributes, listeners, setNodeRef, transform, transition } =
    isDragDisabled ? disabledSortableOptions : sortable;

  if (transform?.scaleY) transform.scaleY = 1;
  if (transform?.scaleX) transform.scaleX = 1;
  const styles = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  useEffect(() => {
    // update input value on actual name update to avoid mismatching values
    setInputValue(id);
  }, [id]);

  useEffect(() => {
    // update the component's width after possible rename
    if (isRenaming) return;

    const width: number = (elementRef.current?.offsetWidth || 0) / 16;
    setElemWidthRem(width);
  }, [isRenaming]);

  // Rename state handlers
  const handleCancelRename = () => {
    setIsRenaming(false);
    setInputValue(id);
  };

  const handleRename = () => {
    if (!onRename) return;
    if (inputValue.length < 1) {
      handleCancelRename();
      return;
    }

    setIsRenaming(false);
    onRename(inputValue);

    // If the value is successfully changed, the input value will be updated with useEffect.
    // If it wasn't changed (e.g., the same name is already taken), it will avoid mismatching values
    setInputValue(id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelRename();
    }
  };

  // details handlers
  const handleShowDetails = () => {
    if (!option) return;

    if (sortable.isOver || isDragDisabled) {
      setIsDetailsVisible(true);
    }
  };

  const handleHideDetails = (event: MouseEvent) => {
    if (!option) return;

    if (
      elementRef.current &&
      !elementRef.current.contains(event.target as Node)
    ) {
      setIsDetailsVisible(false);
    }
  };

  useEffect(() => {
    if (!option) return;

    document.addEventListener('pointerdown', handleHideDetails);
    return () => {
      document.removeEventListener('pointerdown', handleHideDetails);
    };
  }, [option]);

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
          <div className="flex flex-col items-center gap-2">
            <input
              className="max-w-full overflow-hidden border-b border-gray-500 bg-transparent px-2 py-1 text-center focus:outline-none"
              autoFocus
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              maxLength={MAX_OPTION_NAME_LENGTH}
              style={{
                width:
                  'max(' +
                  (elemWidthRem - 2) + // side paddings, 1rem each
                  'rem, ' +
                  inputValue.length * 1.4 +
                  'ch)',
                // ch unit takes width of '0' char.
                // 'm' char is much longer, so length is multiplied by 1.4 to fit all chars,
                // but it makes input longer than its content.
              }}
            />

            <div className="gap4 flex justify-evenly">
              <button
                className={cn(
                  'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
                  'hover:outline-gray-500 active:outline-gray-800',
                )}
                onClick={() => {
                  handleCancelRename();
                }}
                type="button"
              >
                <X className="option__button-icon size-5" />
              </button>

              <button
                className={cn(
                  'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
                  'hover:outline-gray-500 active:outline-gray-800',
                )}
                onClick={handleRename}
                type="button"
              >
                <Check className="option__button-icon size-5" />
              </button>
            </div>
          </div>
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
