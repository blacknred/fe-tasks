import { MutableRefObject, useEffect, useRef } from "react";

export default function useClickOutside(
  ref: MutableRefObject<Element>,
  callback: () => void
) {
  const memoizedCallback = useRef(callback);

  useEffect(() => {
    function handler(ev: MouseEvent) {
      if (!!ev.target && !ref.current.contains(ev.target as Node)) {
        memoizedCallback.current();
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}
