import { FC } from 'react';
import Link from 'next/link';
import {
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Logo from './logo';
import Tooltip from './ui/tooltip';
// svgs
import BurgerMenu from '@/assets/icons/burger-menu.svg';
import Search from '@/assets/icons/search.svg';
import Cart from '@/assets/icons/cart.svg';
import UploadProduct from '@/assets/icons/upload-product.svg';

interface INavbarProps {}

const Navbar: FC<INavbarProps> = () => {
  return (
    <nav className="navbar fixed inset-x-0 top-0 z-10 bg-white py-4 max-md:py-3">
      <div className="container flex gap-10 max-md:justify-between">
        {/* left side */}
        <div className="flex items-center gap-10 max-md:gap-4">
          <button className="hidden max-md:block">
            <BurgerMenu className="size-6" />
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
              id="search"
              type="search"
              autoComplete="off"
              placeholder="Search for products..."
              className="grow rounded-3xl bg-gray-100 py-3 pl-12 pr-4 placeholder:select-none placeholder:text-black placeholder:opacity-40"
            />
          </div>
          <div className="flex min-h-6 select-none items-center gap-3">
            <button className="hidden max-md:block">
              <Search className="size-6" />
            </button>
            <Tooltip tooltipId="cart" tooltip="Go to cart" position="bottom">
              <Link href="">
                <Cart className="size-6" />
              </Link>
            </Tooltip>
            <div className="flex min-w-16 items-center gap-3">
              <SignedOut>
                <SignInButton>
                  <button className="capitalize">Sign in</button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Tooltip
                  tooltipId="new-product"
                  tooltip="Upload a new product"
                  position="bottom"
                  className="size-6"
                >
                  <Link href="/shop/upload-product">
                    <UploadProduct className="size-6" />
                  </Link>
                </Tooltip>

                <ClerkLoading>
                  <Tooltip
                    tooltipId="profile-loading"
                    tooltip="Profile is loading"
                    position="bottom"
                  >
                    <div className="flex size-7 rounded-full bg-gray-200"></div>
                  </Tooltip>
                </ClerkLoading>
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
