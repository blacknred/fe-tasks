import { memo, useRef } from "react";
import { useDrag } from "../../../../hooks/useDrag";
import { IIssue } from "../../types";
import styles from './Board.module.css';

export type CardProps = {
  data: IIssue;
  disabled?: boolean;
  onUpdate: (data: IIssue) => void;
};

export const Card = memo(({ data, disabled, onUpdate }: CardProps) => {
  const draggable = useDrag(undefined, disabled ? null : styles.drag);
  const ref = useRef<HTMLDialogElement | null>(null);

  return (
    <>
      {/* @ts-ignore */}
      <li id={data.id} ref={draggable} className={styles.card} data-priority={data.priority} onClick={() => ref.current.showModal()}>
        <p>{data.title}</p>
        <p>{data.tags?.map(tag => <span key={tag}>#{tag}</span>)}</p>

        {(data.startAt || data.endAt) && <div><p>
          {data.startAt && <span data-start>{new Intl.DateTimeFormat('ru', {
            month: 'short',
            day: 'numeric'
          })
            .format(new Date(data.startAt))
          }</span>}
          {data.endAt && <span data-end>{new Intl.DateTimeFormat('ru', {
            month: 'short',
            day: 'numeric'
          })
            .format(new Date(data.endAt))
          }</span>}
        </p></div>}

        <p>
          <span data-type={data.type}>{data.id}</span>
          <span>
            {data.priority && <span data-priority={data.priority} />}
            <img src={data.assignee?.image} alt={data.assignee?.fullname} />
          </span>
        </p>

        <dialog ref={ref} id="dialog" onClose={(e) => onUpdate(data)}><form method="dialog"><button>ok</button></form></dialog>
      </li>
    </>
  );
})
