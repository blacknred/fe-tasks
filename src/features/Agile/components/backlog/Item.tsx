import { memo } from "react";
import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Board.module.css';

export type ItemProps = IIssue;

export const Item = memo(({ id, title }: ItemProps) => {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={draggable} className={styles.item}>
      <p>{title}</p>
    </li>
  );
})