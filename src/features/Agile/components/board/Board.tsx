import { Fragment, SetStateAction, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useBoardIssues, } from "../../api/getBoardIssues";
import { IBoard, IIssueFilters } from "../../types";
import { Column, ColumnRef } from "../column/Column";
import { DropArea } from "../dropArea/DropArea";
import styles from "./Board.module.css";
import { Card } from "./Card";
import { Header } from "./Header";

export type BoardProps = {
  board: IBoard;
  onUpdate: (action: SetStateAction<IBoard>) => void
}

export function Board({ board, onUpdate }: BoardProps) {
  const { data: issues, epics, sendMessage, isFetching } = useBoardIssues(board);

  const [isEditable, setIsEditable] = useState(false);
  const refs = useRef<Record<string, ColumnRef | null>>({});

  const handleEditingChange = useCallback(async () => {
    setIsEditable(prev => {
      if (prev) {
        // TODO: board update request;
      }
      return !prev;
    })
  }, [])

  const handleColumnRemove = useCallback((name: string) => {
    onUpdate(prev => {
      if (!prev) return prev;
      const columns = prev.columns.filter((c) => c.name !== name)
      return { ...prev, columns }
    });
  }, [])

  const handleColumnShift = useCallback((prevIdx: string, nextIdx: string) => {
    onUpdate(prev => {
      if (!prev) return prev;
      const { columns } = prev;
      const [column] = columns.splice(+prevIdx, 1);
      columns.splice(+nextIdx, 0, column);
      return { ...prev, columns }
    })
  }, []);

  const handleFilterChange = useCallback((filters: IIssueFilters) => {
    for (let col in refs.current) {
      refs.current[col]?.filter(filters);
    }
  }, [])

  const handleCardShift = useCallback((status: string) => (id: string, nextIdx: string) => {
    if (!issues) return;

    for (let col in issues) {
      if (issues[col].every((t) => t.id != id)) continue;

      // @ts-ignore smooth dom updates
      document.startViewTransition(() => {
        flushSync(() => {
          const issue = refs.current?.[col]?.remove(id);
          if (!issue) return;
          issue.status = status;
          refs.current?.[status]?.add(issue, nextIdx);
          sendMessage({ ...issue })
        })
      });
    }
  }, [issues]);

  if (isFetching) return <h1>Loading...</h1>;

  return (
    <>
      <Header
        board={board}
        epics={epics}
        onUpdate={onUpdate}
        onFilter={handleFilterChange}
        isEditable={isEditable}
        onEdit={handleEditingChange}
      />
      <br />
      <main className={styles.grid}>
        <DropArea id={0} onDrop={handleColumnShift} disabled={!isEditable} />

        {board?.columns.map((column, idx) => (
          <Fragment key={column.name}>
            <Column
              idx={idx}
              ref={ref => refs.current[column.status] = ref}
              name={column.name}
              items={issues?.[column.status]}
              editable={isEditable}
              onDropItem={handleCardShift(column.status)}
              onUpdateItem={sendMessage}
              onRemove={handleColumnRemove}
              ItemComponent={Card}
            />

            <DropArea id={idx + 1} onDrop={handleColumnShift} disabled={!isEditable} />
          </Fragment>
        ))}
      </main>
    </>
  );
}
