import { useState } from "react";
import styles from "./Agile.module.css";
import { Gantt } from "./components/gantt/Gantt";
import { Backlog } from "./components/backlog/Backlog";
import { Board } from "./components/board/Board";
import { useParams } from "../../lib/router";

export function Agile() {
  const { projectId } = useParams();
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
        {viewKind === 1 && <Gantt projectId={projectId} />}
        {viewKind === 2 && <Board projectId={projectId} />}
        {viewKind === 3 && <Backlog projectId={projectId} />}
      </main>
    </>
  );
}
