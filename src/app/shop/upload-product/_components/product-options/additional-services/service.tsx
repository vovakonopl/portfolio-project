import { FC } from 'react';
import Image from 'next/image';
import { AdditionalService } from '@/app/shop/upload-product/_utils/structures/additional-service';
import { Edit, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface IServiceProps {
  onDelete: () => void;
  onEdit: () => void;
  service: AdditionalService;
}

const Service: FC<IServiceProps> = ({ onDelete, onEdit, service }) => {
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

  return (
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
      <div className="w-20 rounded-l-xl border-r border-gray-300 bg-gray-50">
        {service.image && (
          <Image
            src={URL.createObjectURL(service.image)}
            className="size-full object-cover"
            alt=""
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
            '-m-1 box-content size-5 p-1 opacity-0 transition-all',
            'hover:text-gray-500 hover:opacity-100 focus-visible:text-gray-800',
            'focus-visible:opacity-100 active:text-gray-800 group-hover:opacity-100',
          )}
          type="button"
          onClick={onDelete}
        >
          <X className="size-full" />
        </button>
        <button
          className={cn(
            '-m-1 box-content size-5 p-1 opacity-0 transition-all',
            'hover:text-gray-500 hover:opacity-100 focus-visible:text-gray-800',
            'focus-visible:opacity-100 active:text-gray-800 group-hover:opacity-100',
          )}
          type="button"
          onClick={onEdit}
        >
          <Edit className="size-full" />
        </button>
      </div>
    </li>
  );
};

export default Service;
