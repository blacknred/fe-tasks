import { useEffect, useRef } from "react";

export function useMouseMove(onMove?: (ev: MouseEvent) => void) {
  const el = useRef<HTMLElement>();

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
      onMove?.(ev);
    }

    el.current?.addEventListener("mousedown", mouseDown);
    document.addEventListener("mousemove", mouseMove);
    document.addEventListener("mouseup", mouseUp);

    return () => {
      el.current?.removeEventListener("mousedown", mouseDown);
      document.removeEventListener("mousemove", mouseMove);
      document.removeEventListener("mouseup", mouseUp);
    };
  }, []);

  return el;
}
