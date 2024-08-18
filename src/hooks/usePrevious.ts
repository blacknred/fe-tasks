import { useEffect, useRef } from "react";

export function usePrevious<T = unknown>(value: T) {
  const prev = useRef<T>();

  useEffect(() => {
    prev.current = value;
  }, [value]);

  return prev.current;
}
