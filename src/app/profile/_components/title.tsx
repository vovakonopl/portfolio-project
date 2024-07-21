import { FC } from 'react';

interface ITitleProps {
  children: React.ReactNode;
  className?: string;
}

const Title: FC<ITitleProps> = ({ children, className }) => {
  return (
    <h4
      className={`mr-2 not-italic text-gray-400 ${className || ''}`.trimEnd()}
    >
      {children}
    </h4>
  );
};

export default Title;
