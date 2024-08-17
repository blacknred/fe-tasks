import { memo } from "react";
import { useDrop } from "../../../hooks/useDrop";
import styles from './Backlog.module.css';

type DropAreaProps = {
  onDrop: (draggableId: string, droppableId: string) => void;
  id: number;
  disabled?: boolean;
}

export const DropArea = memo(({ onDrop, id, disabled }: DropAreaProps) => {
  const droppable = useDrop(onDrop, styles.drop);

  // @ts-ignore
  return <li className={styles.dropArea} ref={disabled ? null : droppable} id={id} />;
})