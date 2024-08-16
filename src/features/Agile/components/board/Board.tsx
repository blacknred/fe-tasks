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

export default function Board({ projectId }: BoardProps) {
  // const [statusses] = useStatusses(projectId);
  const [board] = useBoard(projectId);
  const [boardIssues] = useBoardIssues(projectId);
  console.table(boardIssues);

  const [isEditable, setIsEditable] = useState(false);
  const [columns, setColumns] = useState(board?.columns);
  const [issues, setTasks] = useState(boardIssues);

  const handleColumnReposition = (column, newIndex) => {
    setColumns((prev) => {
      prev.splice(prev.indexOf(column), 1);
      const head = prev.slice(0, newIndex);
      const tail = prev.slice(newIndex, prev.length);
      console.log(head, tail, [...head, column, ...tail]);
      return [...head, column, ...tail];
    });
  };

  const handleCardReposition = (newStatus) => (taskId, newIndex) => {
    console.log("card reposition", newStatus, taskId, newIndex);
    // smooth dom updates
    document.startViewTransition(() => {
      // sync update
      flushSync(() =>
        setTasks((prev) => {
          const idx = prev.findIndex((t) => t.id == taskId);
          prev[idx].status = newStatus;
          prev[idx].boardOrder = newIndex;
          console.log(idx, prev);
          return [...prev];
        })
      );
    });
  };

  const handleCardRemove = useCallback((name: string) => () => {
    setBoard(prev => {
      if (!prev) return prev;
      return { ...prev, columns: prev.columns.filter((c) => c.name !== name) }
    })
  }, [])

  const handleFilterChange = useCallback((filter: keyof IIssueFilters) => (value: string) => {
    setTasks((prev) => {
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
        onSearch={handleFilterChange('search')}
        onEpicChange={handleFilterChange('epicId')}
        onTypeChange={handleFilterChange('type')}
        onPriorityChange={handleFilterChange('priority')}
        onAssigneeChange={handleFilterChange('assigneeId')}
        onEdit={setIsEditable}
        onIssueCreated={console.log}
      />
      <br />

      <main className={styles.grid}>
        <DropArea id={0} onDrop={handleColumnReposition} />

        {board?.columns.map((column, idx) => (
          <Fragment key={column.name}>
            <Column
              title={column.name}
              cards={issues?.[column.status]}
              editable={isEditable}
              onCardReposition={handleCardReposition(column.status)}
              onRemove={handleCardRemove(column.name)}
            />

            <DropArea id={idx + 1} onDrop={handleColumnReposition} />
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
