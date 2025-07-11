import { forwardRef, HTMLAttributes, Ref } from 'react';

type TContainerProps = (
  | HTMLAttributes<HTMLDivElement>
  | HTMLAttributes<HTMLLIElement>
) & { isListItem: boolean };
const ElementWrapper = forwardRef<HTMLElement, TContainerProps>(
  ({ children, isListItem, ...props }, ref) => {
    if (isListItem) {
      return (
        <li
          ref={ref as Ref<HTMLLIElement>}
          {...(props as HTMLAttributes<HTMLLIElement>)}
        >
          {children}
        </li>
      );
    }

    return (
      <div
        ref={ref as Ref<HTMLDivElement>}
        {...(props as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    );
  },
);
ElementWrapper.displayName = 'ElementWrapper';

export default ElementWrapper;
