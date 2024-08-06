import { useState } from "react";
import styles from "./Agile.module.css";
import { Gantt } from "./components/gantt/Gantt";
import { Backlog } from "./components/backlog/Backlog";
import { Board } from "./components/board/Board";

export function Agile() {
  const [viewKind, setViewKind] = useState<1 | 2 | 3>(1);

  return (
    <>
      <h1>Agile</h1>
      <header className={styles.header}>
        <button onClick={() => setViewKind(1)}>Gantt</button>
        <button onClick={() => setViewKind(2)}>Board</button>
        <button onClick={() => setViewKind(3)}>Backlog</button>
        {/* <button onClick={() => refetch(true)}>refetch</button> */}
      </header>
      <br />
      <main className={styles.main}>
        {viewKind === 1 && <Gantt />}
        {viewKind === 2 && <Board />}
        {viewKind === 3 && <Backlog />}
      </main>
    </>
  );
}
