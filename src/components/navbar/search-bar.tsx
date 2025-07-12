'use client';
import {
  ChangeEvent,
  FC,
  KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useResize } from '@/scripts/hooks/useResize';
import { SEARCH_PARAMETER_KEY } from '@/constants/search-parameter-key';

const SCREEN_WIDTH = 768;

interface ISearchBarProps {}

const SearchBar: FC<ISearchBarProps> = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpened, setIsOpened] = useState<boolean>(false); // for smaller screens
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSubmit = () => {
    if (!searchValue) return;

    const param = Object.fromEntries([[SEARCH_PARAMETER_KEY, searchValue]]);
    const searchParams = new URLSearchParams(param);
    router.push(`/shop?${searchParams}`);
    setSearchValue('');
  };

  const handleButtonClick = () => {
    if (isOpened || window.innerWidth >= SCREEN_WIDTH) {
      handleSubmit();
      return;
    }

    // handle opening
    if (!isOpened && window.innerWidth < SCREEN_WIDTH) {
      setIsOpened(true);
    }
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (document.activeElement !== inputRef.current) return;
    if (e.key.toLowerCase() !== 'enter') return;

    handleSubmit();
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  // close input on resize
  useResize(() => {
    if (!isOpened) return;
    if (window.innerWidth >= SCREEN_WIDTH) {
      setIsOpened(false);
    }
  });

  // close if clicked out of container
  const handleCloseSearch = useCallback(() => {
    if (!isOpened) return;

    setSearchValue('');
    setIsOpened(false);
  }, [isOpened]);

  useEffect(() => {
    const handleClose = (e: MouseEvent) => {
      if (containerRef.current?.contains(e.target as HTMLElement)) return;
      handleCloseSearch();
    };

    document.addEventListener('click', handleClose);
    return () => {
      document.removeEventListener('click', handleClose);
    };
  }, [handleCloseSearch]);

  useEffect(() => {
    const handleClose = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'escape') {
        handleCloseSearch();
      }
    };

    document.addEventListener('keydown', handleClose);
    return () => {
      document.removeEventListener('keydown', handleClose);
    };
  }, [handleCloseSearch]);

  return (
    <div
      className={cn(
        'relative flex grow',
        isOpened &&
          'max-md:absolute max-md:inset-0 max-md:z-10 max-md:bg-white max-md:px-4 max-md:py-2',
      )}
      ref={containerRef}
    >
      <button
        className={cn(
          'absolute left-3 top-1/2 size-6 -translate-y-1/2',
          !isOpened && 'max-md:static max-md:translate-y-0',
          isOpened && 'max-md:left-7',
        )}
        onClick={handleButtonClick}
      >
        <Search
          className={cn(
            'size-6 text-gray-500 transition-colors max-md:text-black',
            !isOpened && 'max-md:text-black',
          )}
        />
      </button>

      <input
        autoComplete="off"
        id="search"
        type="search"
        className={cn(
          'grow rounded-3xl bg-gray-100 py-3 pl-12 pr-4',
          'placeholder:select-none placeholder:text-black placeholder:opacity-40',
          !isOpened && 'max-md:w-0 max-md:p-0',
          // isOpened && 'max-md:inset-x-4 max-md:inset-y-2',
        )}
        placeholder="Search for products..."
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={searchValue}
        ref={inputRef}
      />
    </div>
  );
};

export default SearchBar;
