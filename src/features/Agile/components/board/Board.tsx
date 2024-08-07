import { Fragment, useState, useMemo } from "react";
import { useDrag, useDrop } from "./useDnd";
import { getTasks, prepareTasksForBoard, STATUSSES } from "./util";
import styles from "./Board.module.css";
import { flushSync } from "react-dom";

function DropArea({ onDrop, id }) {
  const droppable = useDrop(onDrop, styles.drop);

  return <li className={styles.dropArea} ref={droppable} id={id} />;
}

function Card({ id, title, boardOrder }) {
  const draggable = useDrag(null, styles.drag);

  return (
    <li id={id} ref={draggable} className={styles.card}>
      <div style={{ padding: `${title[0] * 10}px 0px` }}>
        {title}---[{id}]-[{boardOrder}]
      </div>
    </li>
  );
}

function Column({ onRemove, cards, title, onCardReposition, editable }) {
  const draggable = useDrag(null, editable ? styles.drag : "");

  return (
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

export default function Board() {
  const [columns, setColumns] = useState(STATUSSES.slice(0, 3));
  const [tasks, setTasks] = useState(() => getTasks(10));

  const [isColumnsEditable, setIsColumnsEditable] = useState(false);
  const [searchText, setSearchText] = useState("");

  const cards = useMemo(() => {
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

        {columns.map((column, idx) => (
          <Fragment key={column}>
            <Column
              key={column}
              title={column}
              cards={cards[column]}
              editable={isColumnsEditable}
              onCardReposition={handleCardReposition(column)}
              onRemove={() => setColumns(columns.filter((c) => c !== column))}
            />

            <DropArea id={idx + 1} onDrop={handleColumnReposition} />
          </Fragment>
        ))}
        <div>
          <ul>
            {isColumnsEditable
              ? STATUSSES.filter((s) => !columns.includes(s)).map((s) => (
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
