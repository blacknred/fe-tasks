import { memo } from "react";
import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Board.module.css';

export type CardProps = IIssue & {
  disabled?: boolean
};

export const Card = memo(({ id, title, disabled }: CardProps) => {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={disabled ? null : draggable} className={styles.card}>
      <div style={{ padding: `${+title[0] * 10}px 0px` }}>
        {title}---[{id}]
      </div>
    </li>
  );
})