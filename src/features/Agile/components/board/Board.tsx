import { Fragment, useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { useBoard } from "../../api/getBoard";
import { useBoardIssues } from "../../api/getIssues";
import { useStatusses } from "../../api/getStatusses";
import { ID, IIssueFilters } from "../../types";
import styles from "./Board.module.css";
import { Column } from "./Column";
import { DropArea } from "../DropArea";
import { Header } from "./Header";

export type BoardProps = {
  projectId: ID;
};

export function Board({ projectId }: BoardProps) {
  // const [statusses] = useStatusses(projectId);
  const [board] = useBoard(projectId);
  const [columns, setColumns] = useState(board?.columns);
  const [isEditable, setIsEditable] = useState(false);

  const [boardIssues] = useBoardIssues(projectId);
  const [issues, setIssues] = useState(boardIssues);

  const handleColumnReposition = useCallback((prevIdx: string, nextIdx: string) => {
    setColumns((prev) => {
      if (!prev) return prev;
      const [column] = prev.splice(+prevIdx, 1);
      prev.splice(+nextIdx, 0, column);

      // TODO: update on be
      return [...prev];
    });
  }, []);

  const handleCardReposition = (nextColumn: string) => (id: string, nextIdx: string) => {
    // @ts-ignore smooth dom updates
    document.startViewTransition(() => {
      // sync update
      flushSync(() =>
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
  };

  const handleColumnRemove = useCallback((name: string) => {
    setColumns(prev => prev?.filter((c) => c.name !== name))

    // TODO: update on be
  }, [])

  const handleFilterChange = useCallback((filter: keyof IIssueFilters, value: string) => {
    setIssues((prev) => {
      for (let column in prev) {
        switch (filter) {
          case 'type': prev[column] = prev[column].filter(t => t.type === value);
          case 'search': prev[column] = prev[column].filter(t => t.title.includes(value));
          case 'epicId': prev[column] = prev[column].filter(t => 'epicId' in t && t.epicId === value);
          case 'assigneeId': prev[column] = prev[column].filter(t => t.assignee?.id === value);
          case 'priority': prev[column] = prev[column].filter(t => t.priority === value);
          default: ;
        }
      }
      return { ...prev };
    })
  }, [])

  return (
    <>
      <Header
        projectId={projectId}
        onFilterChange={handleFilterChange}
        onIssueCreated={console.log}
        onEdit={setIsEditable}
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
            />

            <DropArea id={idx + 1} onDrop={handleColumnReposition} disabled={!isEditable} />
          </Fragment>
        ))}

        {/* <div>
          <ul>
            {isEditable
              ? statusses?.filter((s) => !columns.includes(s)).map((s) => (
                <li key={s} onClick={() => setColumns([...columns, s])}>
                  {s.toUpperCase()}
                </li>
              ))
              : null}
          </ul>
        </div> */}
      </main>
    </>
  );
}
