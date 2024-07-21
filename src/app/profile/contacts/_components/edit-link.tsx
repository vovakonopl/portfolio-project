import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface IEditLinkProps {
  children: React.ReactNode;
  href: string;
}

const EditLink: FC<IEditLinkProps> = ({ children, href }) => {
  return (
    <Link href={href} className="flex gap-1 underline-offset-2 hover:underline">
      <span className="opacity-40">
        <Image src={'/icons/edit.svg'} alt="" height={12} width={12} />
      </span>
      {children}
    </Link>
  );
};

export default EditLink;
