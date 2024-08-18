import { forwardRef, Fragment, memo, MemoExoticComponent, ReactElement, ReactNode, useEffect, useImperativeHandle, useState } from 'react';
import { useDrag } from '../../../../hooks/useDrag';
import { IIssue, IIssueFilters } from '../../types';
import { filterIssues } from '../../utils';
import { DropArea } from '../dropArea/DropArea';
import styles from './Column.module.css';

export type ColumnProps = {
  name: string;
  items?: IIssue[];
  idx: number;
  editable?: boolean;
  onRemove?: (name: string) => void;
  onDropItem: (draggableId: string, droppableId: string) => void;
  ItemComponent: MemoExoticComponent<(props: IIssue & { disabled?: boolean }) => ReactElement>;
};

export type ColumnRef = {
  filter: (filters: IIssueFilters) => void;
  remove: (draggableIdx: string) => IIssue | undefined;
  add: (issue: IIssue, droppableIdx: string) => void;
}

export const Column = memo(forwardRef<ColumnRef, ColumnProps>(({ items: initialItems, name, onRemove, onDropItem, ItemComponent, idx, editable }, ref) => {
  const draggable = useDrag(undefined, !editable ? null : styles.drag);

  const [items, setItems] = useState(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useImperativeHandle(ref, () => ({
    filter(filters) {
      setItems((prev) => {
        if (!prev || !initialItems) return prev;
        return filterIssues(initialItems, filters);
      })
    },
    remove(id) {
      if (!items) return;
      const idx = items.findIndex(issue => issue.id == id);
      if (idx === -1) return;
      const [item] = items.splice(idx, 1);
      setItems([...items]);
      return item;
    },
    add(issue, idx) {
      setItems(prev => {
        if (!prev) return prev;
        prev.splice(+idx, 0, issue);
        return [...prev];
      })
    }
  }), [setItems, initialItems, items]);

  return (
    // @ts-ignore
    <section ref={draggable} id={idx} className={styles.column} data-disabled={!editable}>
      <div>
        <p>{name.toUpperCase()}: {items?.length}</p>
        {editable && <span onClick={() => onRemove?.(name)}>x</span>}
        {!editable && <span onClick={() => console.log('add issue')}>+</span>}
      </div>
      <ul>
        <DropArea id={0} onDrop={onDropItem} disabled={editable} />
        {items?.map((item, idx) => (
          <Fragment key={item.id}>
            <ItemComponent {...item} disabled={editable} />
            <DropArea id={idx + 1} onDrop={onDropItem} disabled={editable} />
          </Fragment>
        ))}
      </ul>
    </section>
  );
}))