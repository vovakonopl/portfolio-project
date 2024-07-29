'use client';

import { FC, useMemo, useState } from 'react';
import { useResize } from '@/scripts/hooks/useResize';
import NavLink from '@/components/util-components/nav-link';
import { cn } from '@/scripts/classname';
// svgs
import Arrow from '@/assets/icons/arrow.svg';
import Settings from '@/assets/icons/settings.svg';

interface IProfileNavProps {}

const ProfileNav: FC<IProfileNavProps> = () => {
  // open/close navbar ob smaller screen sizes
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  // avoid blinking dark overlay on first appear
  const [canOverlayAppear, setCanOverlayAppear] = useState<boolean>(false);

  useResize(() => {
    const windowMaxWidth: number = 768;
    const windowWidth: number = window.innerWidth;

    if (windowWidth >= windowMaxWidth) {
      setCanOverlayAppear(false);
      setIsNavOpen(false);
    }
  });

  const openNav = (): void => {
    setIsNavOpen(true);
    setCanOverlayAppear(true);
  };
  const closeNav = (): void => {
    setIsNavOpen(false);
  };

  const toggleNavClassName: string = useMemo<string>(() => {
    if (isNavOpen) return 'nav-open';

    if (!isNavOpen && canOverlayAppear) return 'nav-close';

    return 'hidden';
  }, [isNavOpen, canOverlayAppear]);

  return (
    <>
      <nav
        className={cn(
          isNavOpen ? 'left-0' : '-left-60',
          'inset-y-0 z-20 min-w-60 border-r border-solid border-gray-200 bg-white pr-3 pt-3 transition-all duration-300 ease-out max-sm:absolute max-sm:px-3 max-sm:pt-6 sm:max-md:min-w-48',
        )}
      >
        <ul className="flex flex-col gap-2 text-lg">
          <li className="hidden justify-end max-sm:flex">
            <button className="p-2" onClick={closeNav}>
              <Arrow className="size-6 -rotate-90" />
            </button>
          </li>
          <li className="profile__link">
            <NavLink
              href="/profile"
              onClick={closeNav}
              activeClassName="active"
            >
              User
            </NavLink>
          </li>
          <li className="profile__link">
            <NavLink
              href="/profile/contacts"
              onClick={closeNav}
              activeClassName="active"
            >
              Contacts
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="absolute left-2 hidden max-sm:block">
        <button className="p-2" onClick={openNav}>
          <Settings className="size-6" />
        </button>
        <div
          className={cn(
            toggleNavClassName,
            'fixed inset-0 z-10 bg-black transition-all duration-300',
          )}
          onClick={closeNav}
        ></div>
      </div>
    </>
  );
};

export default ProfileNav;
