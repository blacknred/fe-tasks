import { useDrop } from "../../../../hooks/useDrop";
import styles from './Board.module.css';

type DropAreaProps = {
  onDrop: (draggableId: string, droppableId: string) => void;
  id: number;
  disabled?: boolean;
}

export function DropArea({ onDrop, id, disabled }: DropAreaProps) {
  const droppable = useDrop(onDrop, styles.drop);

  // @ts-ignore
  return <li className={styles.dropArea} ref={droppable} id={id} />;
}