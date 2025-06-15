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

const MAX_NAME_LENGTH: number = 25;

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
  isDragDisabled?: boolean;
  dragListeners?: SyntheticListenerMap;
  isListItem?: boolean;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
}

const OptionBox: FC<IOptionBoxProps> = ({
  id,
  children,
  className,
  isDragDisabled = false,
  isListItem = false,
  onDelete,
  onRename,
  dragListeners,
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

  const iconClassName: string = cn(
    'box-content size-4 p-1 text-gray-400 transition-all',
    'hover:text-gray-500 active:text-gray-800',
  );
  const buttonClassName: string =
    'absolute top-1/2 -translate-y-1/2 cursor-pointer opacity-0 transition-all focus:opacity-100 group-hover:opacity-100';

  useEffect(() => {
    // update the component's width after possible rename
    if (isRenaming) return;

    const width: number = (elementRef.current?.offsetWidth || 0) / 16;
    setElemWidthRem(width);
  }, [isRenaming]);

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

  return (
    <OptionBoxContainer
      className={cn('group relative h-min touch-none select-none', className)}
      isListItem={isListItem}
      ref={setNodeRef}
      style={styles}
      {...attributes}
    >
      {!isRenaming && onDelete && (
        <button
          className={cn(buttonClassName, 'left-2')}
          onClick={onDelete}
          type="button"
        >
          <X className={iconClassName} />
        </button>
      )}
      <div
        className={cn(
          'cursor-grab overflow-hidden break-all rounded-md border border-gray-400 px-4 py-2 text-center',
          !isRenaming &&
            'hover:bg-black hover:bg-opacity-5 active:cursor-grabbing active:bg-black active:bg-opacity-10',
          (onDelete || onRename) &&
            !isRenaming &&
            'flex items-center justify-center px-8',
        )}
        {...(isRenaming ? {} : listeners)} // disable dragging while renaming
        ref={elementRef}
      >
        {isRenaming && (
          <div className="flex flex-col gap-2">
            <input
              className="max-w-full overflow-hidden border-b border-gray-500 bg-transparent px-2 py-1 text-center focus:outline-none"
              autoFocus
              type="text"
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleRename}
              maxLength={MAX_NAME_LENGTH}
              style={{
                width:
                  'max(' +
                  (elemWidthRem - 2) + // side paddings, 1rem each
                  'rem, ' +
                  inputValue.length * 1.4 +
                  'ch)',
                // ch unit takes width of '0' char.
                // 'm' char is much longer, so it is multiplied by 1.4 to fit all chars,
                // but it makes input longer than its content.
              }}
            />

            <div className="gap4 flex justify-evenly">
              <button
                className={cn(
                  'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
                  'hover:outline-gray-500 active:outline-gray-800',
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelRename();
                }}
                type="button"
              >
                <X className={cn(iconClassName, 'size-5')} />
              </button>

              <button
                className={cn(
                  'cursor-pointer rounded-md outline outline-1 -outline-offset-4 outline-gray-400',
                  'hover:outline-gray-500 active:outline-gray-800',
                )}
                onClick={handleRename}
                type="button"
              >
                <Check className={cn(iconClassName, 'size-5')} />
              </button>
            </div>
          </div>
        )}

        {!isRenaming && children}
      </div>

      {!isRenaming && onRename && (
        <button
          className={cn(buttonClassName, 'right-2')}
          onClick={() => setIsRenaming((prevState) => !prevState)}
          type="button"
        >
          <Edit className={iconClassName} />
        </button>
      )}
    </OptionBoxContainer>
  );
};

export default OptionBox;
