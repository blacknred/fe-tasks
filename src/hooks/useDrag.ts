import { useEffect, useRef } from "react";

export function useDrag(onDrag?: () => void, activeClass = "") {
  const draggable = useRef<HTMLElement>();

  useEffect(() => {
    function handleDragStart(ev: DragEvent) {
      ev.dataTransfer!.setData("text", (ev.target as HTMLElement).id);
      ev.dataTransfer!.effectAllowed = "move";
      onDrag?.();
    }
    function handleDragEnter(ev: DragEvent) {
      (ev.target as HTMLElement).classList?.add(activeClass);
    }
    function handleDragEnd(ev: DragEvent) {
      (ev.target as HTMLElement).classList.remove(activeClass);
    }

    draggable.current?.setAttribute("draggable", "true");
    draggable.current?.addEventListener("dragstart", handleDragStart);
    draggable.current?.addEventListener("dragenter", handleDragEnter);
    draggable.current?.addEventListener("dragend", handleDragEnd);

    return () => {
      draggable.current?.removeEventListener("dragstart", handleDragStart);
      draggable.current?.removeEventListener("dragenter", handleDragEnter);
      draggable.current?.removeEventListener("dragend", handleDragEnd);
    };
  }, []);

  return draggable;
}
