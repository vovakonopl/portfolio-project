import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { SecondaryOption } from '@/app/shop/upload-product/_utils/structures/secondary-option';
import OptionDetails from '../option-details';
import OptionBoxContainer from '../option-box-container';

interface IOptionBoxProps {
  id: string;
  children?: ReactNode;
  className?: string;
  dragListeners?: SyntheticListenerMap;
  isDragDisabled?: boolean;
  isListItem?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onRename?: (newName: string) => void;
  option?: SecondaryOption;
}

const OptionBox: FC<IOptionBoxProps> = ({ children, option, ...props }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleShowDetails = () => {
    if (option) {
      setIsDetailsVisible(true);
    }
  };

  const handleHideDetails = useCallback(
    (event: MouseEvent) => {
      if (!option) return;

      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node)
      ) {
        setIsDetailsVisible(false);
      }
    },
    [option],
  );

  useEffect(() => {
    if (!option) return;

    document.addEventListener('pointerdown', handleHideDetails);
    return () => {
      document.removeEventListener('pointerdown', handleHideDetails);
    };
  }, [option, handleHideDetails]);

  return (
    <OptionBoxContainer
      {...props}
      disableListeners={isDetailsVisible}
      onClick={() => {
        props.onClick?.();
        handleShowDetails();
      }}
      ref={elementRef}
    >
      {/* Default state */}
      {children}

      {/* Detailed info on click, while not dragged */}
      {option && isDetailsVisible && <OptionDetails option={option} />}
    </OptionBoxContainer>
  );
};

export default OptionBox;
