import { Fragment, memo } from 'react';
import { useDrag } from '../../../../hooks/useDrag';
import { IIssue } from '../../types';
import { DropArea } from '../DropArea';
import styles from './Board.module.css';
import { Card } from './Card';

export type ColumnProps = {
  name: string;
  idx: number;
  editable: boolean;
  cards?: IIssue[];
  onRemove: (name: string) => void;
  onAddIssue: () => void;
  onCardReposition: (taskId: string, newIndex: string) => void;
};

export const Column = memo(({ cards, name, idx, editable, onAddIssue, onRemove, onCardReposition }: ColumnProps) => {
  const draggable = useDrag(undefined, !editable ? null : styles.drag);

  return (
    // @ts-ignore
    <div ref={draggable} id={idx} className={styles.column} data-disabled={!editable}>
      <div>
        <p>{name.toUpperCase()}: {cards?.length}</p>
        {editable && <span onClick={() => onRemove(name)}>x</span>}
        {!editable && <span onClick={onAddIssue}>+</span>}
      </div>
      <ul>
        <DropArea id={0} onDrop={onCardReposition} disabled={editable} />
        {cards?.map((card, idx) => (
          <Fragment key={card.id}>
            <Card {...card} disabled={editable} />
            <DropArea id={idx + 1} onDrop={onCardReposition} disabled={editable} />
          </Fragment>
        ))}
      </ul>
    </div>
  );
})