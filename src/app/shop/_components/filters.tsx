import Image from 'next/image';
import { FC } from 'react';

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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-black">Filters</h2>
          <Image
            src="/icons/filters.svg"
            alt=""
            width={24}
            height={24}
            className="h-6 opacity-40 max-md:hidden"
          />
          <button
            className="-mb-1 -mr-2 -mt-1 hidden p-2 max-md:inline-block"
            onClick={close}
          >
            <Image
              src="/icons/close.svg"
              alt=""
              width={16}
              height={16}
              className="opacity-40"
            />
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
