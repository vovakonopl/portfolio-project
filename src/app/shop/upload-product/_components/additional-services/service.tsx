import { FC, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Edit, X } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/cn';
import { AdditionalService } from '@/app/shop/upload-product/_utils/structures/additional-service';
import ServiceModal from './service-modal';

interface IServiceProps {
  onDelete: () => void;
  onEdit: (originalName: string, service: AdditionalService) => void;
  service: AdditionalService;
}

const Service: FC<IServiceProps> = ({ onDelete, onEdit, service }) => {
  const [isActiveModal, setIsActiveModal] = useState<boolean>(false);
  const closeModalRef = useRef<() => void>(() => {});
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: service.name });
  attributes['aria-describedby'] = ''; // This attribute causes hydration error.

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const imageUrl = useMemo(() => {
    return service.image ? URL.createObjectURL(service.image) : null;
  }, [service.image]);

  const handleCloseModal = () => {
    setIsActiveModal(false);
  };

  return (
    <>
      <li
        className={cn(
          'group flex w-full cursor-grab select-none rounded-xl border border-gray-300',
          'bg-white transition-shadow hover:shadow-md active:cursor-grabbing',
          isDragging && 'z-10',
        )}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <div className="relative w-20 rounded-l-xl border-r border-gray-300 bg-gray-50">
          {imageUrl && (
            <Image
              alt=""
              className="absolute inset-0 size-full rounded-l-xl object-cover"
              src={imageUrl}
              width={100}
              height={100}
            />
          )}
        </div>

        <div className="flex min-h-20 flex-1 flex-col justify-evenly px-4 py-2">
          <h5 className="font-medium">{service.name}</h5>
          <span className="">{service.price.toFixed(2)}$</span>
          {service.description && (
            <p className="text-sm text-gray-500">{service.description}</p>
          )}
        </div>

        <div className="flex flex-col justify-evenly pr-4 text-gray-400">
          <button
            className={cn(
              'not-hoverable-opacity-100 -m-1 box-content size-5 p-1 opacity-0 transition-all',
              'hover:text-gray-500 hover:opacity-100 focus-visible:text-gray-800',
              'focus-visible:opacity-100 active:text-gray-800 group-hover:opacity-100',
            )}
            data-no-dnd={true}
            type="button"
            onClick={onDelete}
          >
            <X className="size-full" />
          </button>
          <button
            className={cn(
              'not-hoverable-opacity-100 -m-1 box-content size-5 p-1 opacity-0 transition-all',
              'hover:text-gray-500 hover:opacity-100 focus-visible:text-gray-800',
              'focus-visible:opacity-100 active:text-gray-800 group-hover:opacity-100',
            )}
            data-no-dnd={true}
            type="button"
            onClick={() => setIsActiveModal(true)}
          >
            <Edit className="size-full" />
          </button>
        </div>
      </li>

      {isActiveModal && (
        <ServiceModal
          closeModalRef={closeModalRef}
          initialValues={service}
          onClose={handleCloseModal}
          onSubmit={(newData: AdditionalService) =>
            onEdit(service.name, newData)
          }
        />
      )}
    </>
  );
};

export default Service;
