import { useCallback, useRef, ChangeEvent, useEffect } from 'react';

const useWindowListener = (type: string, callback: (e: any) => void, options?: boolean | AddEventListenerOptions, condition: boolean = true) => {
  useEffect(() => {
    if (condition) {
      window.addEventListener(type, callback, options);
      return () => {
        window.removeEventListener(type, callback);
      };
    }
  }, [callback, condition, type, options]);
};

const useClickOutside = (callback: (e: any) => void, eventType = 'mousedown') => {
  const elementRef = useRef<HTMLDivElement>(null);
  const handler = useCallback((event: ChangeEvent<HTMLElement>) => {
    if (!elementRef.current?.contains(event.target)) {
      callback(event);
    }
  }, [callback]);
  useWindowListener(eventType, handler);
  return elementRef;
};
export default useClickOutside;
