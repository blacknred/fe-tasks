import { useDrag } from "../../../../hooks/useDrag";
import styles from './Board.module.css';

export type CardProps = {
  id: string;
  title: string;
  boardOrder: number;
};

export function Card({ id, title, boardOrder }: CardProps) {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={draggable} className={styles.card}>
      <div style={{ padding: `${+title[0] * 10}px 0px` }}>
        {title}---[{id}]-[{boardOrder}]
      </div>
    </li>
  );
}