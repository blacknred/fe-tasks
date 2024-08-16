import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Board.module.css';

export type ItemProps = IIssue;

export function Item({ id, title }: ItemProps) {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={draggable} className={styles.item}>
      <p>{title}</p>
    </li>
  );
}