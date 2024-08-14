import { Fragment, useState, useMemo } from "react";
import styles from "./Board.module.css";
import { flushSync } from "react-dom";
import { useSprintTasks } from "../../api/getTasks";
import { useStatusses } from "../../api/getStatusses";
import { useBoards } from "../../api/getBoards";
import { DropArea } from "./DropArea";
import { Column } from "./Column";

export type BoardProps = {
  projectId: string;
};

export default function Board({ projectId }: BoardProps) {
  const [boards] = useBoards(projectId);

  const [tasks, _, isPending, refetch] = useSprintTasks(projectId, '1');
  console.table(tasks);

  const [statusses] = useStatusses(projectId);
  // const [columns, setColumns] = useState(STATUSSES.slice(0, 3));
  const [isColumnsEditable, setIsColumnsEditable] = useState(false);
  const [searchText, setSearchText] = useState("");

  const cards = useMemo(() => {
    if (!tasks) return [];
    const data = tasks.filter(
      (t) => !searchText || t.title.includes(searchText)
    );
    return prepareTasksForBoard(data);
  }, [tasks, searchText]);

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

  if (!tasks) return "...Loading";

  return (
    <>
      <header className={styles.header}>
        <input onChange={(e) => setSearchText(e.target.value)}></input>
        <button onClick={() => setIsColumnsEditable((prev) => !prev)}>
          <span>&#9881;</span>
        </button>
      </header>
      <br />
      
      <main className={styles.grid}>
        <DropArea id={0} onDrop={handleColumnReposition} />

        {boards?.[0].columns.map((column, idx) => (
          <Fragment key={column.name}>
            <Column
              title={column.name}
              cards={cards[column]}
              editable={isColumnsEditable}
              onCardReposition={handleCardReposition(column.status)}
              onRemove={() => setColumns(columns.filter((c) => c !== column))}
            />

            <DropArea id={idx + 1} onDrop={handleColumnReposition} />
          </Fragment>
        ))}
        <div>
          <ul>
            {isColumnsEditable
              ? statusses?.filter((s) => !columns.includes(s)).map((s) => (
                <li key={s} onClick={() => setColumns([...columns, s])}>
                  {s.toUpperCase()}
                </li>
              ))
              : null}
          </ul>
        </div>
      </main>
    </>
  );
}
