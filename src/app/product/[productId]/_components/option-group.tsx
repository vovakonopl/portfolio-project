import { FC } from 'react';
import { ProductVariant, SecondaryOption } from '@prisma/client';
import { TProduct } from '@/types/product';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface IOptionGroupProps {
  activeOption: string;
  groupName: string;
  options: (TProduct | ProductVariant | SecondaryOption)[];
  updateURL: (optionName: string) => URLSearchParams;
}

const OptionGroup: FC<IOptionGroupProps> = ({
  activeOption,
  groupName,
  options,
  updateURL,
}) => {
  const isActive = (option: string | null): boolean => activeOption === option;
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-medium">{groupName}</h2>
      <ul className="flex flex-wrap items-center gap-2 text-sm">
        {options.map((option) => (
          <li key={option.optionName} className="flex">
            <Link
              className={cn(
                'word-break max-w-48 rounded border border-black bg-white px-2 py-1',
                'text-center transition-colors',
                isActive(option.optionName) && 'border-blue-200 bg-blue-50',

                // hover effects
                !isActive(option.optionName) &&
                  'hover:bg-black hover:bg-opacity-5 active:bg-black active:bg-opacity-10',
                isActive(option.optionName) &&
                  'hover:bg-blue-100 active:bg-blue-200',
              )}
              href={`?${updateURL(option.optionName || '')}`}
            >
              {option.optionName}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OptionGroup;
