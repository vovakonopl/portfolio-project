import Link from 'next/link';
import { FC } from 'react';

interface ILogoProps {}

const Logo: FC<ILogoProps> = () => {
  return (
    <div className="font-poppins text-3xl font-bold max-md:text-2xl">
      <Link href="/">Trinket</Link>
    </div>
  );
};

export default Logo;
