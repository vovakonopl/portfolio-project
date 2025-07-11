import { FC } from 'react';
import { SlidersVertical, X } from 'lucide-react';

// components for filters only
const Title: FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h3 className="text-xl font-bold text-black">{children}</h3>;
};
const Option: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <li className="text-neutral-600">
      <span>{children}</span>
    </li>
  );
};
const Hr: FC = () => {
  return <hr className="border-gray-200" />;
};

interface IFiltersProps {
  close?: () => void;
}

const Filters: FC<IFiltersProps> = ({ close }) => {
  return (
    <aside className="max-h-[32rem] w-72 rounded-2xl border border-gray-200 pb-4 pt-4 max-md:hidden">
      <div className="no-scrollbar flex max-h-full flex-col gap-6 overflow-auto px-4 pb-6 pt-1">
        <div className="bg-whitemax-md:-mt-5 -top-5 flex flex-col gap-6 max-md:pt-5">
          <div className="flex items-center gap-4 md:justify-between">
            <h2 className="text-xl font-bold text-black">Filters</h2>
            <SlidersVertical className="size-6 fill-gray-400" />
            <button
              className="-mb-1 -mr-2 -mt-1 hidden p-2 max-md:ml-auto max-md:inline-block"
              onClick={close}
            >
              <X className="size-4 fill-gray-400" />
            </button>
          </div>
          <Hr />
        </div>

        <div className="flex flex-col">
          <Title>Price</Title>
          {/* inputs */}
        </div>
        <Hr />

        <button className="rounded-full bg-black py-3 font-medium text-white transition duration-150 ease-in-out hover:opacity-80 active:scale-95 active:opacity-100">
          Apply filters
        </button>
      </div>
    </aside>
  );
};

export default Filters;
