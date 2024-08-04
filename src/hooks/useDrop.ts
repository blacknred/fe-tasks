import { useEffect, useRef } from "react";

export function useDrop(
  onDrop?: (dragId: string, dropId: string) => void,
  activeClass = ""
) {
  const dropZone = useRef<HTMLElement>();

  useEffect(() => {
    function handleDrop(ev: DragEvent) {
      ev.preventDefault();
      ev.stopPropagation();
      (ev.target as HTMLElement).classList.remove(activeClass);
      const dragId = ev.dataTransfer!.getData("text");
      const dropId = (ev.target as HTMLElement).id;
      onDrop?.(dragId, dropId);
    }
    function handleDragOver(ev: DragEvent) {
      ev.preventDefault();
      ev.dataTransfer!.dropEffect = "move";
      (ev.target as HTMLElement).classList.add(activeClass);
    }
    function handleDragLeave(ev: DragEvent) {
      (ev.target as HTMLElement).classList.remove(activeClass);
    }

    dropZone.current?.addEventListener("drop", handleDrop);
    dropZone.current?.addEventListener("dragover", handleDragOver);
    dropZone.current?.addEventListener("dragleave", handleDragLeave);

    return () => {
      dropZone.current?.removeEventListener("drop", handleDrop);
      dropZone.current?.removeEventListener("dragover", handleDragOver);
      dropZone.current?.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);

  return dropZone;
}
