import { useEffect, useRef } from "react";

export default function useClickOutside(onClick: () => void) {
  const ref = useRef<HTMLElement | null>(null);
  const memoizedCallback = useRef(onClick);

  useEffect(() => {
    function handler(ev: MouseEvent | TouchEvent) {
      if (!ev.target || !ref.current) return;
      if (ref.current.contains(ev.target as Node)) {
        memoizedCallback.current();
      }
    }

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.addEventListener("touchstart", handler);
    };
  }, []);

  return ref;
}
