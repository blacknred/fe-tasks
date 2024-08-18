import { memo } from "react";
import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Backlog.module.css';

export type ItemProps = IIssue;

export const Item = memo(({ id, title, name, type, epicId }: ItemProps) => {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={draggable} className={styles.item}>
      <span data-type={type} />
      <p>
        {title} <br/>
        <b>{name}</b> <i>{epicId?.toLowerCase()}</i>
      </p>
    </li>
  );
})