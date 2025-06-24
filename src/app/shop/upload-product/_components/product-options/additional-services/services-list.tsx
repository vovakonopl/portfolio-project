import { FC } from 'react';
import Service from './service';
import {
  AdditionalService,
  TServiceMap,
} from '@/app/shop/upload-product/_utils/structures/additional-service';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { reorderArray } from '@/app/shop/upload-product/_utils/reorder-array';

interface IServicesListProps {
  additionalServices: TServiceMap;
  onReorder: (newOrder: string[]) => void;
}

const ServicesList: FC<IServicesListProps> = ({
  additionalServices,
  onReorder,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const services: AdditionalService[] = Array.from(additionalServices.values());
  const handleOnDragEnd = (e: DragEndEvent) => {
    const updatedOrder: AdditionalService[] | null = reorderArray(
      e,
      services,
      'name',
    );

    if (updatedOrder) {
      onReorder(updatedOrder.map((service) => service.name));
    }
  };

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleOnDragEnd}
      modifiers={[restrictToParentElement]}
      sensors={sensors}
    >
      <ol className="flex w-full flex-col gap-4">
        <SortableContext
          items={Array.from(additionalServices.values()).map(
            (service) => service.name,
          )}
          strategy={verticalListSortingStrategy}
          disabled={additionalServices.size < 2}
        >
          {Array.from(additionalServices.values()).map(
            (service: AdditionalService) => (
              <Service
                onDelete={() => {}}
                onEdit={() => {}}
                service={service}
                key={service.name}
              />
            ),
          )}
        </SortableContext>
      </ol>
    </DndContext>
  );
};

export default ServicesList;
