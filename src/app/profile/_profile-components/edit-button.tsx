import Image from 'next/image';
import { FC } from 'react';

interface IEditProfileProps {
  onClick: () => void;
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}

const EditProfile: FC<IEditProfileProps> = ({
  onClick,
  children,
  containerClassName,
  className,
}) => {
  return (
    <div
      className={`flex flex-1 items-start justify-center font-normal text-gray-400 ${containerClassName || ''}`.trimEnd()}
    >
      <button
        className={`flex items-start gap-1 pl-4 capitalize underline-offset-2 hover:underline active:opacity-60 ${className || ''}`.trimEnd()}
        onClick={onClick}
      >
        {children}
        <span className="opacity-40">
          <Image src={'/icons/edit.svg'} alt="" height={12} width={12} />
        </span>
      </button>
    </div>
  );
};

export default EditProfile;
