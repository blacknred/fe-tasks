import { MutableRefObject, ReactEventHandler, useEffect, useRef } from "react";

export default function useClickOutside(
  ref: MutableRefObject<Element>,
  callback: ReactEventHandler<UIEvent>
) {
  const memoizedCallback = useRef(callback);

  useEffect(() => {
    function handler({ target }: UIEvent) {
      if (!ref.current.contains(target)) {
        memoizedCallback.current();
      }
    }
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
}
