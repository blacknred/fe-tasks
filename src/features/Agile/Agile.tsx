import { useState } from "react";
import { useParams } from "../../lib/router";
import styles from "./Agile.module.css";
import { Backlog } from "./components/backlog/Backlog";
import { Board } from "./components/board2/Board";
import { Gantt } from "./components/gantt/Gantt";

export function Agile() {
  const { projectId } = useParams();
  const [viewKind, setViewKind] = useState<1 | 2 | 3>(3);

  return (
    <>
      <h1>Agile</h1>
      <header className={styles.header}>
        <button className={viewKind === 1 ? styles.active : undefined} onClick={() => setViewKind(1)}>Gantt</button>
        <button className={viewKind === 2 ? styles.active : undefined} onClick={() => setViewKind(2)}>Backlog</button>
        <button className={viewKind === 3 ? styles.active : undefined} onClick={() => setViewKind(3)}>Board</button>
      </header>
      <br />
      <br />
      <main className={styles.main}>
        {viewKind === 1 && <Gantt projectId={projectId} />}
        {viewKind === 2 && <Backlog projectId={projectId} />}
        {viewKind === 3 && <Board />}
      </main>
    </>
  );
}
