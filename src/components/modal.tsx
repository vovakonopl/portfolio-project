import Image from 'next/image';
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

class ModalClassName {
  public className: string = '';

  private withOpacityAppearance(isOpen: boolean): ModalClassName {
    this.className += `${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity ease-in `;

    return this;
  }

  private centered(): ModalClassName {
    this.className +=
      'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ';

    return this;
  }

  private withFlex(): ModalClassName {
    this.className += 'flex flex-col ';

    return this;
  }

  private withDefaultShape(): ModalClassName {
    this.className += 'overflow-hidden p-8 rounded-md ';

    return this;
  }

  constructor(
    styleOptions: IDefaultStyles,
    className: string,
    isOpened: boolean,
  ) {
    if (styleOptions.appearanceMethod === 'opacity') {
      this.withOpacityAppearance(isOpened);
    }

    if (styleOptions.centered) {
      this.centered();
    }

    if (styleOptions.defaultShape) {
      this.withDefaultShape();
    }

    if (styleOptions.flex) {
      this.withFlex();
    }

    this.className += className;
  }
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
  const timeoutIdRef = useRef<NodeJS.Timeout>();
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
    const defaultClassName: string =
      'min-h-[18rem] bg-white max-sm:inset-0 max-sm:px-3 sm:min-w-[32rem] max-sm:rounded-none max-sm:translate-x-0 max-sm:translate-y-0';

    const modalClassName: ModalClassName = new ModalClassName(
      defaultStyleOptions,
      className || defaultClassName,
      isOpen,
    );

    return modalClassName.className;
  }, [className, defaultStyles, isOpen]);

  return (
    <div
      ref={modalRef}
      className={`${isOpen ? 'bg-opacity-40' : 'bg-opacity-0'} fixed inset-0 z-20 bg-black transition-colors ease-in ${backdropClassName || ''}`.trimEnd()}
      onClick={handleCloseRef.current}
    >
      <div className={modalClassName} onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute right-3 top-3 p-1"
          onClick={handleCloseRef.current}
        >
          <Image src="/icons/close.svg" alt="X" width={12} height={12} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
