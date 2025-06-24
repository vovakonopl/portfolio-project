import { ActionDispatch, FC, useRef, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import {
  ServiceStateActions,
  TAction as TServicesAction,
} from '@/app/shop/upload-product/_reducers/service-reducer';
import {
  AdditionalService,
  TServiceMap,
} from '@/app/shop/upload-product/_utils/structures/additional-service';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { reorderArray } from '@/app/shop/upload-product/_utils/reorder-array';
import {
  InteractiveKeyboardSensor,
  InteractivePointerSensor,
  InteractiveTouchSensor,
} from '@/app/shop/upload-product/_utils/interactive-sensors';
import Service from './service';
import { MAX_SERVICES } from '@/app/shop/upload-product/_utils/constants';
import { cn } from '@/lib/cn';
import { PlusCircle } from 'lucide-react';
import ServiceModal from '@/app/shop/upload-product/_components/product-options/additional-services/service-modal';

interface IServicesListProps {
  additionalServices: TServiceMap;
  dispatch: ActionDispatch<[action: TServicesAction]>;
}

const ServicesList: FC<IServicesListProps> = ({
  additionalServices,
  dispatch,
}) => {
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);
  const closeModalRef = useRef<() => void>(() => {});
  const sensors = useSensors(
    useSensor(InteractivePointerSensor),
    useSensor(InteractiveTouchSensor),
    useSensor(InteractiveKeyboardSensor, {
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
      const newOrder: string[] = updatedOrder.map((service) => service.name);
      dispatch({
        type: ServiceStateActions.Reorder,
        payload: { newOrder },
      });
    }
  };

  const onDelete = (name: string) => {
    dispatch({
      type: ServiceStateActions.RemoveService,
      payload: { name },
    });
  };

  const onEdit = (originalName: string, service: AdditionalService) => {
    dispatch({
      type: ServiceStateActions.UpdateService,
      payload: { originalName, service },
    });
  };

  // modal
  const handleCloseModal = () => {
    setIsActiveModal(false);
  };

  const onSubmit = (service: AdditionalService) => {
    dispatch({ type: ServiceStateActions.AddService, payload: { service } });
  };

  return (
    <>
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={handleOnDragEnd}
        modifiers={[restrictToParentElement]}
        sensors={sensors}
      >
        <ol className="flex w-full touch-none flex-col gap-4">
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
                  onDelete={() => onDelete(service.name)}
                  onEdit={onEdit}
                  service={service}
                  key={service.name}
                />
              ),
            )}
          </SortableContext>

          {services.length < MAX_SERVICES && (
            <button
              className={cn(
                'flex w-fit items-center justify-center gap-3 self-center rounded',
                'border border-gray-400 bg-black bg-opacity-0 px-8 py-2',
                'hover:bg-opacity-5 focus-visible:bg-opacity-5 active:bg-opacity-10',
              )}
              type="button"
              onClick={() => setIsActiveModal(true)}
            >
              <span>Add new service</span>
              <PlusCircle className="size-5" />
            </button>
          )}
        </ol>
      </DndContext>

      {isActiveModal && (
        <ServiceModal
          closeModalRef={closeModalRef}
          onClose={handleCloseModal}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};

export default ServicesList;
