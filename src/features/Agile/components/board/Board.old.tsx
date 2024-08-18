import { Fragment, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useBoard } from "../../api/getBoard";
import { useBoardIssues } from "../../api/getIssues";
import { useStatusses } from "../../api/getStatusses";
import { IBoard, ID, IIssue, IIssueFilters, IIssueStatus } from "../../types";
import { Column, ColumnRef } from "../column/Column";
import { DropArea } from "../dropArea/DropArea";
import styles from "./Board.module.css";
import { Card } from "./Card";
import { Header } from "./Header";

export type BoardProps = {
  projectId: ID;
};

export function Board({ projectId }: BoardProps) {
  const { data: board } = useBoard(projectId);
  const { data: boardIssues } = useBoardIssues(projectId);
  const { data: statusses } = useStatusses(projectId);

  if (!board || !boardIssues || !statusses) return null;

  return <BoardContent projectId={projectId} board={board} issues={boardIssues} statusses={statusses} />
}

type BoardContentProps = BoardProps & {
  board?: IBoard;
  issues?: Record<string, IIssue[]>;
  statusses?: IIssueStatus[];
}

function BoardContent({ projectId, board: initialBoard, issues, statusses }: BoardContentProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  const refs = useRef<Record<string, ColumnRef | null>>({});

  const handleEditingChange = useCallback(() => {
    setIsEditable(prev => {
      if (!prev) {
        // TODO: update board on be
      }
      return !prev;
    })
  }, [])

  const handleColumnRemove = useCallback((name: string) => {
    setBoard(prev => {
      if (!prev) return prev;
      prev.columns = prev.columns.filter((c) => c.name !== name)
      return { ...prev }
    })
  }, [])

  const handleColumnShift = useCallback((prevIdx: string, nextIdx: string) => {
    setBoard((prev) => {
      if (!prev) return prev;
      const [column] = prev.columns.splice(+prevIdx, 1);
      prev.columns.splice(+nextIdx, 0, column);
      return { ...prev };
    });
  }, []);

  const handleFilterChange = useCallback((filters: IIssueFilters) => {
    Object.values(refs.current).forEach(ref => ref?.filter(filters))
  }, [])

  const handleCardShift = useCallback((status: string) => (id: string, nextIdx: string) => {
    for (let col in issues) {
      if (issues[col].every((t) => t.id != id)) continue;

      // @ts-ignore smooth dom updates
      document.startViewTransition(() => {
        flushSync(() => {
          const issue = refs.current?.[col]?.remove(id);
          if (!issue) return;
          issue.status = status;
          refs.current?.[status]?.add(issue, nextIdx);
        })
      });
    }

    // TODO: update on be
  }, []);

  return (
    <>
      <Header
        projectId={projectId}
        onFilterChange={handleFilterChange}
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
              onRemove={handleColumnRemove}
              ItemComponent={Card}
            />

            <DropArea id={idx + 1} onDrop={handleColumnShift} disabled={!isEditable} />
          </Fragment>
        ))}

        <div className={styles.statusList}>
          <ul>
            {isEditable
              ? statusses?.filter((s) => board?.columns.every(c => c.status !== s.name)).map(({ name }) => (
                <li key={name} onClick={() => setBoard(prev => {
                  if (!prev) return prev;
                  prev.columns.push({ name, status: name, issueOrder: {} });
                  return { ...prev };
                })}>
                  {name.toUpperCase()}
                </li>
              ))
              : null}
          </ul>
        </div>
      </main>
    </>
  );
}
