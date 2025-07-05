import { cn } from '@/lib/cn';
import {
  FC,
  Children,
  cloneElement,
  isValidElement,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { FieldError } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import Label from '../label';
import SelectOption, { ISelectOptionProps } from './select-option';
import SelectInputField, {
  ISelectInputFieldProps,
} from '@/components/ui/select/select-input-field';

interface ISelectProps {
  id?: string;
  children?: React.ReactNode;
  containerClassName?: string;
  error?: FieldError;
  fullHeight?: boolean;
  fullWidth?: boolean;
  label: string;
  name: string;
  onChange: (value: string) => void;
  value?: string;
}

const Select: FC<ISelectProps> = ({
  id,
  children,
  containerClassName,
  error,
  fullHeight,
  fullWidth,
  label,
  name,
  onChange,
  value,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // for animation
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout>(undefined);
  const optionListRef = useRef<HTMLUListElement>(null);
  const optionsRef = useRef<Array<HTMLElement>>(undefined);

  const handleClose = () => {
    clearTimeout(timeoutIdRef.current);

    setIsClosing(true);

    timeoutIdRef.current = setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
    }, 150);
  };
  const handleOpen = () => {
    clearTimeout(timeoutIdRef.current);

    setIsOpen(true);
    setIsClosing(false);
  };
  const handleButtonClick = () => {
    if (isOpen && !isClosing) {
      handleClose();
      return;
    }

    handleOpen();
  };

  const handleChange = (value: string) => {
    onChange(value);

    handleClose();
  };

  // update options ref when the list drops down
  useEffect(() => {
    if (!isOpen || !optionListRef.current) {
      optionsRef.current = [];
      return;
    }

    optionsRef.current = Array.from(
      optionListRef.current.querySelectorAll('li > input'),
    );
  }, [isOpen]);

  const getActiveOption = useCallback<() => HTMLInputElement | null>(() => {
    const options: Array<HTMLElement> | undefined = optionsRef.current;
    if (!options || options.length === 0) return null;

    const activeElement: Element | null = document.activeElement;
    if (!activeElement) return null;

    const activeOption = options.find(
      (option: HTMLElement) => option === activeElement,
    ) as HTMLInputElement | undefined;

    return activeOption || null;
  }, []);

  const optionsTabbing = useCallback<(tab: 'next' | 'prev') => void>(
    (tab: 'next' | 'prev') => {
      const options: Array<HTMLElement> | undefined = optionsRef.current;
      if (!options || options.length === 0) return;

      const activeElement: Element | null = document.activeElement;
      if (!activeElement) return;

      const activeElementIndex: number = options.indexOf(
        activeElement as HTMLElement,
      );

      // if an active element is not child of this Select component
      if (activeElementIndex < 0) return;

      const tabIndex = tab === 'next' ? 1 : -1;
      let nextElementIndex: number = activeElementIndex + tabIndex;

      // from 1 end to another
      if (nextElementIndex < 0) {
        nextElementIndex = options.length - 1;
      } else if (nextElementIndex >= options.length) {
        nextElementIndex = 0;
      }

      const newActiveElement = options[nextElementIndex] as HTMLElement;
      newActiveElement.focus();
    },
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!e.key.startsWith('Arrow') && e.key !== 'Enter') return;
    e.preventDefault();

    switch (e.key) {
      // prev el
      case 'ArrowUp':
      case 'ArrowLeft':
        optionsTabbing('prev');
        break;

      // next el
      case 'ArrowDown':
      case 'ArrowRight':
        optionsTabbing('next');
        break;

      // change value
      case 'Enter':
        const activeOption: HTMLInputElement | null = getActiveOption();
        if (!activeOption) break;

        handleChange(activeOption.value);
        break;
    }
  };
  const onBlur = (
    e: React.FocusEvent<HTMLButtonElement | HTMLInputElement, Element>,
  ) => {
    if (!optionsRef.current) return;
    const isOptionActive: boolean = optionsRef.current.includes(
      e.relatedTarget as HTMLElement,
    );

    if (!isOptionActive) {
      handleClose();
    }
  };

  const buttonId: string = id || name;

  return (
    <div
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (isOpen && e.key === 'Escape') {
          handleClose();
          (document.activeElement as HTMLElement)?.blur();
        }
      }}
      className={cn(
        'select-field relative min-w-fit',
        !value && 'no-value',
        isOpen && 'open',
        fullHeight && 'h-full',
        fullWidth && 'w-full',
        containerClassName,
      )}
    >
      <button
        id={buttonId}
        type="button"
        onBlur={onBlur}
        onClick={handleButtonClick}
        className={cn(
          'peer flex min-h-12 w-full min-w-40 items-center gap-1 rounded border border-gray-400 px-4 py-2 outline-none outline-1 outline-offset-0 transition-all placeholder:select-none placeholder:text-transparent focus:border-blue-400 focus:outline-blue-400 focus:placeholder:text-gray-400',
          error && 'border-rose-700 outline-rose-700',
        )}
      >
        <Label htmlFor={buttonId} className="static -top-2 flex-1 text-start">
          {label}
        </Label>

        {/* display value under the label when it selected */}
        {value && <p>{value}</p>}

        <ChevronDown
          size={20}
          className={cn(isOpen && !isClosing && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <ul
          ref={optionListRef}
          className={cn(
            'appear absolute left-4 right-4 z-10 h-fit rounded-b border border-gray-400 border-t-transparent bg-white py-2 transition-opacity peer-focus:border-t-blue-400',
            isClosing && 'disappear',
          )}
        >
          {/* if no children */}
          {Children.count(children) === 0 && (
            <p className="my-1 text-center text-lg italic text-gray-400">
              No options are available
            </p>
          )}

          {Children.map(children, (child) => {
            // clone element only if it is a SelectOption or SelectInputField component
            if (
              isValidElement<ISelectInputFieldProps>(child) &&
              child.type === SelectInputField
            ) {
              return cloneElement<ISelectInputFieldProps>(child, {
                ...child.props,
                name,
                onBlur,
                onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (['ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) {
                    return;
                  }

                  onKeyDown(e);
                },
              });
            }

            if (
              isValidElement<ISelectOptionProps>(child) &&
              child.type === SelectOption
            ) {
              const isCurrentlyChecked: boolean =
                child.props && child.props.value === value;

              const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                handleChange(e.target.value);
              };

              return cloneElement<ISelectOptionProps>(child, {
                ...child.props,
                checked: isCurrentlyChecked,
                name,
                onChange,
                onBlur,
                onKeyDown,
              });
            }

            return child;
          })}
        </ul>
      )}
    </div>
  );
};

export default Select;
