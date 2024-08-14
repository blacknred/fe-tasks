import { useDrag } from "../../../../hooks/useDrag";
import styles from './Board.module.css';

export type ItemProps = {
  id: string;
  title: string;
  boardOrder: number;
};

export function Item({ id, title, boardOrder }: ItemProps) {
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