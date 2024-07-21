import { FC } from 'react';

interface ITitleProps {
  children: React.ReactNode;
}

const Title: FC<ITitleProps> = ({ children }) => {
  return <h4 className="mr-2 min-w-44 not-italic text-gray-400">{children}</h4>;
};

export default Title;
