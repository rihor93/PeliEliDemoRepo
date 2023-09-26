import { useEffect, useRef } from "react";

type Callback = (...args: any[]) => any;

export const useInterval = (callback: Callback, delay: number) => {
  const intervalRef = useRef<undefined | number>(undefined);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => savedCallback.current();
    intervalRef.current = window.setInterval(tick, delay);

    return function cleanup() {
      return clearInterval(intervalRef.current);
    };
  }, [delay]);
  return intervalRef;
};