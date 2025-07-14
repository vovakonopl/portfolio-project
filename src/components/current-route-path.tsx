'use client';

import { FC, Fragment } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/cn';

interface ICurrentRoutePathProps {}

const CurrentRoutePath: FC<ICurrentRoutePathProps> = () => {
  const pathname = usePathname();

  // remove the first route which is always home '/'
  const routes = pathname.split('/').slice(1);

  // merges pages from array into a valid path up to specified index
  const getPath = (idx: number) => {
    return `/${routes.slice(0, idx + 1).join('/')}`;
  };

  return (
    <nav className="mb-4 flex gap-2 text-gray-400 max-md:mb-2 max-md:text-sm">
      <Link
        href="/"
        className={cn(
          routes.length === 0 && 'text-black underline underline-offset-4',
        )}
      >
        Home
      </Link>

      {routes.map((route: string, idx: number) => (
        <Fragment key={idx}>
          <span>&gt;</span>
          <Link
            className="text-black underline underline-offset-4"
            href={getPath(idx)}
          >
            {route}
          </Link>
        </Fragment>
      ))}

      {}
    </nav>
  );
};

export default CurrentRoutePath;
