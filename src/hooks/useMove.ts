import { useEffect, useRef } from "react";

export function useMove(onMove?: (ev: MouseEvent) => void) {
  const ref = useRef<HTMLElement>();
  const memoizedCallback = useRef(onMove);

  useEffect(() => {
    let isActive = false;

    function mouseDown(ev: MouseEvent) {
      ev.stopPropagation();
      isActive = true;
    }
    function mouseUp(ev: MouseEvent) {
      ev.stopPropagation();
      isActive = false;
    }
    function mouseMove(ev: MouseEvent) {
      ev.stopPropagation();
      if (!isActive) return;
      memoizedCallback.current?.(ev);
    }

    ref.current?.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      ref.current?.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return ref;
}
