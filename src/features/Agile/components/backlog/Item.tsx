import { memo } from "react";
import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Backlog.module.css';

export type ItemProps = {
  data: IIssue;
}

export const Item = memo(({ data: { id, title, type, epicId } }: ItemProps) => {
  const draggable = useDrag(undefined, styles.drag);

  return (
    // @ts-ignore
    <li id={id} ref={draggable} className={styles.item}>
      <span data-type={type} />
      <span data-type={type} />
      <span data-type={type} />
      <p>
        {title} <br />
        <b>{id}</b> <i>{epicId?.toLowerCase()}</i>
      </p>
    </li>
  );
})