import { useEffect, useRef } from 'react';

export function useResize(callback: () => void): void {
  const timeoutIdRef = useRef<NodeJS.Timeout>(undefined);

  useEffect(() => {
    const windowResize = () => {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(callback, 150);
    };

    window.addEventListener('resize', windowResize);

    return () => {
      window.removeEventListener('resize', windowResize);
    };
  }, [callback]);
}
