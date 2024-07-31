import { useState } from "react";
import styles from "./Issues.module.css";

export function Issues() {
  const [viewKind, setViewKind] = useState<1 | 2 | 3>(1);

  return (
    <>
      <h1>Issues</h1>
      <header className={styles.header}>
        <button onClick={() => setViewKind(1)}>Gantt</button>
        <button onClick={() => setViewKind(2)}>Canban</button>
        <button onClick={() => setViewKind(3)}>Backlog</button>
        {/* <button onClick={() => refetch(true)}>refetch</button> */}
      </header>
      <br />
      <main className={styles.main}>
        {viewKind === 1 && <p>Gantt</p>}
        {viewKind === 2 && <p>Board</p>}
        {viewKind === 3 && <p>Backlog</p>}
      </main>
    </>
  );
}
