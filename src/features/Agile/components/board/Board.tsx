import { Fragment, useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { useBoard } from "../../api/getBoard";
import { useBoardIssues } from "../../api/getIssues";
import { useStatusses } from "../../api/getStatusses";
import { IBoardColumn, ID, IIssue, IIssueFilters, IIssueStatus } from "../../types";
import { filterIssues } from "../../utils";
import { DropArea } from "../DropArea";
import styles from "./Board.module.css";
import { Column } from "./Column";
import { Header } from "./Header";

export type BoardProps = {
  projectId: ID;
};

export function Board({ projectId }: BoardProps) {
  const [board] = useBoard(projectId);
  const [boardIssues] = useBoardIssues(projectId);
  const [statusses] = useStatusses(projectId);

  if (!board || !boardIssues || !statusses) return null;

  return <BoardContent projectId={projectId} boardColumns={board?.columns} boardIssues={boardIssues} statusses={statusses} />
}

type BoardContentProps = BoardProps & {
  boardColumns?: IBoardColumn[];
  boardIssues?: Record<string, IIssue[]>;
  statusses?: IIssueStatus[];
}

function BoardContent({ projectId, boardColumns, boardIssues, statusses }: BoardContentProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [columns, setColumns] = useState(boardColumns);
  const [issues, setIssues] = useState(boardIssues);

  const handleColumnReposition = useCallback((prevIdx: string, nextIdx: string) => {
    setColumns((prev) => {
      if (!prev) return prev;
      const [column] = prev.splice(+prevIdx, 1);
      prev.splice(+nextIdx, 0, column);
      return [...prev];
    });
  }, []);

  const handleEditingChange = useCallback(() => {
    setIsEditable(prev => {
      if (!prev) {
        // TODO: update board on be
      }
      return !prev;
    })
  }, [])

  const handleCardReposition = useCallback((nextColumn: string) => (id: string, nextIdx: string) => {
    // @ts-ignore smooth dom updates
    document.startViewTransition(() => {
      // sync update
      flushSync(() =>
        // @ts-ignore
        setIssues((prev) => {
          if (!prev) return prev;

          for (let column in prev) {
            const idx = prev[column].findIndex((t) => t.id == id);
            if (idx === -1) continue;

            const [issue] = prev[column].splice(idx, 1);
            prev[column] = [...prev[column]];
            issue.status = nextColumn;

            prev[nextColumn].splice(+nextIdx, 0, issue);
            prev[nextColumn] = [...prev[nextColumn]];

            // TODO: update on be
            return { ...prev }
          }
        })
      );
    });
  }, []);

  const handleColumnRemove = useCallback((name: string) => {
    setColumns(prev => prev?.filter((c) => c.name !== name))

    // TODO: update on be
  }, [])

  const handleFilterChange = useCallback((filters: IIssueFilters) => {
    setIssues((prev) => {
      if (!prev || !boardIssues) return prev;
      for (let column in prev) {
        prev[column] = filterIssues(boardIssues[column], filters);
      }
      return { ...prev };
    })
  }, [boardIssues])

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
        <DropArea id={0} onDrop={handleColumnReposition} disabled={!isEditable} />

        {columns?.map((column, idx) => (
          <Fragment key={column.name}>
            <Column
              idx={idx}
              name={column.name}
              cards={issues?.[column.status]}
              editable={isEditable}
              onCardReposition={handleCardReposition(column.status)}
              onRemove={handleColumnRemove}
              onAddIssue={console.log}
            />

            <DropArea id={idx + 1} onDrop={handleColumnReposition} disabled={!isEditable} />
          </Fragment>
        ))}

        <div>
          <ul>
            {isEditable
              ? statusses?.filter((s) => columns?.every(c => c.status !== s.name)).map(({ name }) => (
                <li key={name} onClick={() => setColumns(prev => {
                  if (!prev) return prev;
                  const column = { name, status: name, issueOrder: {} };
                  return [...prev, column];
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
