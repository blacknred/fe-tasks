import { Fragment } from 'react';
import { useDrag } from '../../../../hooks/useDrag';
import styles from './Board.module.css';
import { Card, CardProps } from './Card';
import { DropArea } from './DropArea';

export type ColumnProps = {
  title: string;
  cards: CardProps[];
  onRemove: () => void;
  onCardReposition: (taskId: string, newIndex: string) => void;
  editable: boolean;
};

export function Column({ onRemove, cards, title, onCardReposition, editable }: ColumnProps) {
  const draggable = useDrag(undefined, editable ? styles.drag : "");

  return (
    // @ts-ignore
    <div ref={draggable} id={title} className={styles.column}>
      <div>
        <p>
          {title.toUpperCase()}: {cards.length}
        </p>
        {!!editable && <span onClick={onRemove}>x</span>}
      </div>
      <ul>
        <DropArea id={0} onDrop={onCardReposition} disabled={editable} />
        {cards.map((card, idx) => (
          <Fragment key={card.id}>
            <Card {...card} />
            <DropArea
              id={idx + 1}
              onDrop={onCardReposition}
              disabled={editable}
            />
          </Fragment>
        ))}
      </ul>
    </div>
  );
}