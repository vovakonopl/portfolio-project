import { FC, forwardRef, HTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '@/lib/cn';
import OptionBox from '@/app/shop/upload-product/_components/product-options/secondary-group/option-box';
import ElementWrapper from './element-wrapper';
import { useResize } from '@/scripts/hooks/useResize';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';

interface IOptionGroupContainerProps
  extends HTMLAttributes<HTMLDivElement | HTMLLIElement> {
  children: ReactNode;
  dragListeners?: SyntheticListenerMap;
  groupName: string;
  isListItem?: boolean;
  onGroupDelete?: () => void;
  onGroupRename: (newName: string) => void;
  ref?: Ref<HTMLDivElement>;
  toggleList: (state?: boolean) => void;
}

const OptionGroupContainer: FC<IOptionGroupContainerProps> = forwardRef(
  (
    {
      children,
      dragListeners,
      groupName,
      isListItem = false,
      onGroupDelete,
      onGroupRename,
      toggleList,
      ...props
    },
    ref,
  ) => {
    // dropdown list for smaller screens
    // hide list on resize when it's no longer a vertical list of options
    useResize(() => {
      const windowMaxWidth: number = 640;
      const windowWidth: number = window.innerWidth;

      if (windowWidth >= windowMaxWidth) {
        toggleList(false);
      }
    });

    const handleClick = () => {
      if (window.screen.width <= 640) {
        toggleList();
      }
    };

    return (
      <ElementWrapper
        {...props}
        className={cn(
          'box-border flex w-full cursor-default items-stretch gap-4',
          'max-sm:flex-col max-sm:gap-0 max-sm:overflow-hidden',
          props.className,
        )}
        isListItem={isListItem}
        ref={ref}
      >
        <div
          className={cn(
            'flex w-56 border-r-2 border-gray-400 py-2 pl-4 pr-8',
            'max-sm:w-full max-sm:border-r-0 max-sm:px-4 max-sm:py-0',
          )}
        >
          <OptionBox
            id={groupName}
            className="my-auto max-h-fit w-full bg-white"
            onClick={handleClick}
            onDelete={onGroupDelete}
            onRename={onGroupRename}
            isDragDisabled={true}
            dragListeners={dragListeners}
          >
            {groupName}
          </OptionBox>
        </div>

        {children}
      </ElementWrapper>
    );
  },
);
OptionGroupContainer.displayName = 'OptionGroupContainer';

export default OptionGroupContainer;
