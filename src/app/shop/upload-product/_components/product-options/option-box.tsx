import { FC, forwardRef, HTMLAttributes } from 'react';
import { Edit, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  dragListeners?: ReturnType<typeof useSortable>['listeners'];
  isListItem?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

const OptionBox: FC<IOptionBoxProps> = ({
  id,
  children,
  className,
  isDragDisabled = false,
  isListItem = false,
  onDelete,
  onEdit,
  dragListeners,
}) => {
  const disabledSortableOptions = {
    attributes: {},
    listeners: dragListeners,
    setNodeRef: undefined,
    transform: null,
    transition: undefined,
  };
  const sortable = useSortable({ id });
  const { attributes, listeners, setNodeRef, transform, transition } =
    isDragDisabled ? disabledSortableOptions : sortable;

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

  return (
    <OptionBoxContainer
      className={cn('group relative touch-none select-none', className)}
      isListItem={isListItem}
      ref={setNodeRef}
      style={styles}
      {...attributes}
    >
      {onDelete && (
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
          'cursor-grab rounded-md border border-gray-400 px-4 py-2 text-center',
          'hover:bg-black hover:bg-opacity-5 active:cursor-grabbing active:bg-black active:bg-opacity-10',
          (onDelete || onEdit) && 'flex items-center justify-center px-8',
        )}
        {...listeners}
      >
        {children}
      </div>
      {onEdit && (
        <button
          className={cn(buttonClassName, 'right-2')}
          onClick={onEdit}
          type="button"
        >
          <Edit className={iconClassName} />
        </button>
      )}
    </OptionBoxContainer>
  );
};

export default OptionBox;
