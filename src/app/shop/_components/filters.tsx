import { FC } from 'react';
// svgs
import FiltersIcon from '@/assets/icons/filters.svg';
import Close from '@/assets/icons/close.svg';

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
    <div className="no-scrollbar relative flex h-full flex-col gap-6 overflow-y-auto px-4 pb-6 pt-1">
      <div className="inset-x-4 -top-5 flex flex-col gap-6 bg-white max-md:sticky max-md:-mt-5 max-md:pt-5">
        <div className="flex items-center gap-4 md:justify-between">
          <h2 className="text-xl font-bold text-black">Filters</h2>
          <FiltersIcon className="size-6 fill-gray-400" />
          <button
            className="-mb-1 -mr-2 -mt-1 hidden p-2 max-md:ml-auto max-md:inline-block"
            onClick={close}
          >
            <Close className="size-4 fill-gray-400" />
          </button>
        </div>
        <Hr />
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <Hr />
      {/* options per category */}
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>
      <div className="flex flex-col">
        <Title>Price</Title>
        {/* inputs */}
      </div>

      <button className="rounded-full bg-black py-3 font-medium text-white transition duration-150 ease-in-out hover:opacity-80 active:scale-95 active:opacity-100">
        Apply filters
      </button>
    </div>
  );
};

export default Filters;
