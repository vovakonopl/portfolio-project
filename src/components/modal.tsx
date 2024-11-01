import { cn } from '@/lib/cn';
import { X } from 'lucide-react';
import { FC, useEffect, useMemo, useRef, useState } from 'react';

const tabbableElements = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
];

interface IDefaultStyles {
  appearanceMethod: 'opacity' | null;
  centered: boolean;
  flex: boolean;
  defaultShape: boolean;
}

interface IModalProps {
  backdropClassName?: string;
  children: React.ReactNode;
  className?: string;
  closeModalRef?: React.MutableRefObject<() => void>;
  defaultStyles?: Partial<IDefaultStyles>;
  onClose?: () => void;
}

const Modal: FC<IModalProps> = ({
  backdropClassName,
  children,
  className,
  closeModalRef,
  defaultStyles,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const timeoutIdRef = useRef<NodeJS.Timeout>(undefined);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleCloseRef = useRef<() => void>(() => {
    setIsOpen(false);

    clearTimeout(timeoutIdRef.current);

    timeoutIdRef.current = setTimeout(() => {
      onClose?.();
    }, 150);
  });

  useEffect(() => {
    setIsOpen(true);

    // list of tabbable elements inside the modal
    const modalNodes: NodeListOf<Element> = modalRef.current!.querySelectorAll(
      tabbableElements.join(','),
    );
    const modalElements = Array.from(modalNodes) as Array<HTMLElement>;

    let activeElementIndex: number = -1;

    const keyHandlers = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseRef.current();

        // prevent focusing after pressing esc
        const activeElement = document.activeElement as HTMLElement | null;
        activeElement?.blur();
      }
      if (e.key === 'Tab') {
        e.preventDefault();

        // if shift+tab => focus previous element, otherwise focus next
        if (e.shiftKey) {
          activeElementIndex--;
          if (activeElementIndex < 0) {
            activeElementIndex = modalElements.length - 1;
          }
        } else {
          activeElementIndex++;
          if (activeElementIndex >= modalElements.length) {
            activeElementIndex = 0;
          }
        }

        modalElements[activeElementIndex].focus();
      }
    };

    window.addEventListener('keydown', keyHandlers);

    return () => {
      window.removeEventListener('keydown', keyHandlers);
    };
  }, []);

  useEffect(() => {
    // lift the closing function to the parent component
    if (!closeModalRef) return;
    closeModalRef.current = handleCloseRef.current;
  }, [closeModalRef]);

  const modalClassName: string = useMemo<string>(() => {
    const defaultStyleOptions: IDefaultStyles = {
      appearanceMethod: 'opacity',
      centered: true,
      flex: true,
      defaultShape: true,

      // replace default options with selected ones
      ...defaultStyles,
    };

    const modalClassName = cn(
      'min-h-64 bg-white max-sm:inset-0 max-sm:px-3 sm:min-w-[32rem] max-sm:rounded-none max-sm:translate-x-0 max-sm:translate-y-0',
      defaultStyleOptions?.appearanceMethod === 'opacity' &&
        `transition-opacity ease-in ${isOpen ? 'opacity-100' : 'opacity-0'}`,
      defaultStyleOptions?.centered &&
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
      defaultStyleOptions?.defaultShape && 'overflow-hidden p-8 rounded-md',
      defaultStyleOptions?.flex && 'flex flex-col',
      className,
    );

    return modalClassName;
  }, [className, defaultStyles, isOpen]);

  return (
    <div
      ref={modalRef}
      className={cn(
        isOpen ? 'bg-opacity-40' : 'bg-opacity-0',
        'fixed inset-0 z-20 bg-black transition-colors ease-in',
        backdropClassName,
      )}
      onClick={handleCloseRef.current}
    >
      <div className={modalClassName} onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-3 top-3 p-1"
          onClick={handleCloseRef.current}
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
