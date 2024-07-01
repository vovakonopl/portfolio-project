import { FC } from 'react';
import Logo from './util-components/logo';

interface IFooterProps {}

const Footer: FC<IFooterProps> = () => {
  return (
    <footer className="absolute inset-x-0 bottom-0 flex bg-gray-100 py-8">
      <div className="container">
        <Logo />
      </div>
      <div>{/* select language */}</div>
      <div>{/* text */}</div>
    </footer>
  );
};

export default Footer;
