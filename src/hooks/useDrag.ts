import { useEffect, useRef } from "react";

export function useDrag(onDrag?: () => void, activeClass = "") {
  const draggable = useRef<HTMLElement | null>(null);
  const memoizedCallback = useRef(onDrag);

  useEffect(() => {
    if (!activeClass) return;
    
    function handleDragStart(ev: DragEvent) {
      ev.stopPropagation();
      ev.dataTransfer!.setData("text", (ev.target as HTMLElement).id);
      (ev.target as HTMLElement).classList.add(activeClass);
      memoizedCallback.current?.();
    }

    function handleDragEnd(ev: DragEvent) {
      ev.stopPropagation();
      ev.dataTransfer!.setData("text", "");
      (ev.target as HTMLElement).classList.remove(activeClass);
    }

    draggable.current?.setAttribute("draggable", "true");
    draggable.current?.addEventListener("dragstart", handleDragStart);
    draggable.current?.addEventListener("dragend", handleDragEnd);

    return () => {
      draggable.current?.setAttribute("draggable", "false");
      draggable.current?.removeEventListener("dragstart", handleDragStart);
      draggable.current?.removeEventListener("dragend", handleDragEnd);
    };
  }, [activeClass]);

  return draggable;
}
