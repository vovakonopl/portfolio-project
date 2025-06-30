import { FC, HTMLAttributes, ReactNode } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { cn } from '@/lib/cn';
import { MAX_OPTIONS_IN_GROUP } from '@/app/shop/upload-product/_utils/constants';
import { PlusCircle } from 'lucide-react';
import {
  InteractivePointerSensor,
  InteractiveTouchSensor,
} from '@/app/shop/upload-product/_utils/interactive-sensors';

interface IOptionListContainerProps extends HTMLAttributes<HTMLOListElement> {
  children: ReactNode;
  handleDragEnd: (e: DragEndEvent) => void;
  itemsCount: number;
  onOptionAdd: () => void;
}

const OptionListContainer: FC<IOptionListContainerProps> = ({
  children,
  handleDragEnd,
  itemsCount,
  onOptionAdd,
  ...props
}) => {
  const sensors = useSensors(
    useSensor(InteractivePointerSensor),
    useSensor(InteractiveTouchSensor),
  );

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToParentElement]}
      sensors={sensors}
    >
      <ol
        {...props}
        className={cn(
          'relative flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2',
          props.className,
        )}
      >
        {children}

        {itemsCount < MAX_OPTIONS_IN_GROUP && (
          <button
            className={cn(
              '-m-2 box-content p-2 text-gray-400 transition-colors',
              'hover:text-gray-500 active:text-gray-800',
            )}
            type="button"
            onClick={onOptionAdd}
          >
            <PlusCircle className="size-6" />
          </button>
        )}
      </ol>
    </DndContext>
  );
};

export default OptionListContainer;
