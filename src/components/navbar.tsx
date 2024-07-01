import Image from 'next/image';
import Link from 'next/link';
import { FC } from 'react';
import Logo from './util-components/logo';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

interface INavbarProps {}

const Navbar: FC<INavbarProps> = () => {
  return (
    <nav className="navbar fixed inset-x-0 top-0 z-10 bg-white py-4 max-md:py-3">
      <div className="container flex gap-10 max-md:justify-between">
        {/* left side */}
        <div className="flex items-center gap-10 max-md:gap-4">
          <button className="hidden max-md:block">
            <Image
              src="/icons/burger-menu.svg"
              alt="menu"
              width={24}
              height={24}
            />
          </button>
          <Logo />
          <ul className="flex gap-6 capitalize max-md:hidden">
            <li className="link">
              <Link href="/shop">Shop</Link>
            </li>
            <li className="link">
              <Link href="/">On sale</Link>
            </li>
          </ul>
        </div>

        {/* right side */}
        <div className="flex grow items-center gap-10 max-md:grow-0 max-md:gap-3">
          <div className="navbar__search relative flex grow max-md:hidden">
            <input
              type="search"
              placeholder="Search for products..."
              className="grow rounded-3xl bg-gray-100 py-3 pl-12 pr-4 placeholder:select-none placeholder:text-black placeholder:opacity-40"
            />
          </div>
          <div className="flex h-6 select-none gap-3">
            <button className="hidden max-md:block">
              <Image
                src="/icons/search.svg"
                alt="search"
                width={24}
                height={24}
              />
            </button>
            <Link href="">
              <Image
                src="/icons/cart.svg"
                alt="cart"
                width={24}
                height={24}
                className="size-6"
              />
            </Link>
            <div className="flex w-13 justify-center">
              <SignedOut>
                <SignInButton>
                  <button className="capitalize">Sign in</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  userProfileUrl="/profile"
                  userProfileMode="navigation"
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
