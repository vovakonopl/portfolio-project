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
      href={href}
      className={`${className || ''} ${pathname === href ? activeClassName : ''}`.trim()}
      {...props}
    >
      {children}
    </Link>
  );
};

export default NavLink;
