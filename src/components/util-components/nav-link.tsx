import { cn } from '@/scripts/classname';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { FC } from 'react';

interface INavLinkProps extends LinkProps {
  children: React.ReactNode;
  activeClassName: string;
  className?: string;
}

const NavLink: FC<INavLinkProps> = ({
  children,
  href,
  className,
  activeClassName,
  ...props
}) => {
  const pathname = usePathname();

  return (
    <Link
      {...props}
      href={href}
      className={cn(className, pathname === href && activeClassName)}
    >
      {children}
    </Link>
  );
};

export default NavLink;
