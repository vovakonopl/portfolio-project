import { useEffect, useRef } from 'react';

export function useResize(callback: () => void): void {
  const timeoutIdRef = useRef<NodeJS.Timeout>(undefined);
  const callbackRef = useRef<() => void>(callback);

  useEffect(() => {
    const windowResize = () => {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = setTimeout(callbackRef.current, 150);
    };

    window.addEventListener('resize', windowResize);

    return () => {
      window.removeEventListener('resize', windowResize);
    };
  }, []);
}
