import { useState } from "react";
import { useParams } from "../../lib/router";
import styles from "./Agile.module.css";
import { useBoards } from "./api/getBoards";
import { Backlog } from "./components/backlog/Backlog";
import { Board } from "./components/board/Board";
import { Gantt } from "./components/gantt/Gantt";

export function Agile() {
  const { projectId } = useParams();
  const { data: boards, isFetching, setData } = useBoards(projectId);

  const [viewKind, setViewKind] = useState<number>(-2);

  if (isFetching || !boards) return <h1>Loading...</h1>;

  return (
    <>
      <h1>Agile</h1>
      <header className={styles.header}>
        <button className={viewKind === -2 ? styles.active : undefined} onClick={() => setViewKind(-2)}>Gantt</button>
        <button className={viewKind === -1 ? styles.active : undefined} onClick={() => setViewKind(-1)}>Backlog</button>
        {boards?.map(({ id, name }, idx) => <button key={id} className={viewKind === idx ? styles.active : undefined} onClick={() => setViewKind(idx)}>{name}</button>)}
      </header>
      <br />
      <br />
      <main className={styles.main}>
        {viewKind === -2 && <Gantt projectId={projectId} />}
        {viewKind === -1 && <Backlog projectId={projectId} />}
        {viewKind !== -2 && viewKind !== -1 && <Board board={boards[viewKind]} onUpdate={setData(viewKind)} />}
      </main>
    </>
  );
}
