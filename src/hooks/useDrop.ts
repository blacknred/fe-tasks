import { useEffect, useRef } from "react";

export function useDrop(
  onDrop?: (dragId: string, dropId: string) => void,
  activeClass = ""
) {
  const droppable = useRef<HTMLElement>();
  const memoizedCallback = useRef(onDrop);

  useEffect(() => {
    function handleDragEnter(ev: DragEvent) {
      ev.preventDefault();
      (ev.target as HTMLElement).classList.add(activeClass);
    }

    function handleDragLeave(ev: DragEvent) {
      ev.preventDefault();
      (ev.target as HTMLElement).classList.remove(activeClass);
    }

    function handleDragOver(ev: DragEvent) {
      ev.preventDefault();
      ev.dataTransfer!.dropEffect = "move";
    }

    function handleDrop(ev: DragEvent) {
      ev.preventDefault();
      (ev.target as HTMLElement).classList.remove(activeClass);
      const draggableId = ev.dataTransfer!.getData("text");
      const droppableId = (ev.target as HTMLElement).id;
      memoizedCallback.current?.(draggableId, droppableId);
    }

    droppable.current?.addEventListener("dragenter", handleDragEnter);
    droppable.current?.addEventListener("dragleave", handleDragLeave);
    droppable.current?.addEventListener("dragover", handleDragOver);
    droppable.current?.addEventListener("drop", handleDrop);

    return () => {
      droppable.current?.removeEventListener("dragenter", handleDragEnter);
      droppable.current?.removeEventListener("dragleave", handleDragLeave);
      droppable.current?.removeEventListener("dragover", handleDragOver);
      droppable.current?.removeEventListener("drop", handleDrop);
    };
  }, []);

  return droppable;
}
