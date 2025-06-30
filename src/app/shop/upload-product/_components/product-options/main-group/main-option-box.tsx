import { FC } from 'react';
import OptionBoxContainer from '../option-box-container';

interface IMainOptionBoxProps {
  id: string;
  isActive: boolean;
  children?: React.ReactNode;
  className?: string;
  isDragDisabled?: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
}

const MainOptionBox: FC<IMainOptionBoxProps> = ({ children, ...props }) => {
  return <OptionBoxContainer {...props}>{children}</OptionBoxContainer>;
};

export default MainOptionBox;
