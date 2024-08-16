import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Board.module.css';

export type CardProps = IIssue;

export function Card({ id, title }: CardProps) {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={draggable} className={styles.card}>
      <div style={{ padding: `${+title[0] * 10}px 0px` }}>
        {title}---[{id}]
      </div>
    </li>
  );
}