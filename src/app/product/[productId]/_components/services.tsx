import { FC } from 'react';
import { Service } from '@prisma/client';
import { cn } from '@/lib/cn';
import Image from 'next/image';
import Price from '@/components/product/price';

interface IServicesProps {
  services: Service[];
}

const Services: FC<IServicesProps> = ({ services }) => {
  return (
    <>
      <hr className="border-gray-300" />
      <ul className="flex flex-1 flex-col gap-2">
        {services.map((service) => (
          <li
            className="flex gap-2 rounded-xl border border-gray-300"
            key={service.id}
          >
            {service.imagePath && (
              <div
                className={cn(
                  'relative box-content min-h-16 w-16 rounded-l-xl',
                  'border-r border-gray-300 bg-gray-100',
                )}
              >
                <Image
                  alt=""
                  src={`/api/image/${service.imagePath}`}
                  width={400}
                  height={400}
                  className="absolute inset-0 size-full rounded-l-xl object-cover"
                />
              </div>
            )}

            <div className="flex flex-1 flex-col px-2 py-1">
              <h3 className="font-medium">{service.name}</h3>
              <Price
                className="text-sm"
                discountPercent={service.discountPercent}
                price={Math.floor(service.priceInCents / 100)}
              />
              {service.description && (
                <p className="word-break text-xs text-gray-500">
                  {service.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Services;
