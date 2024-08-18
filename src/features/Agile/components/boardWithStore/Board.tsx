import { Fragment } from "react";
import { DropArea } from "../dropArea/DropArea";
import styles from "./Board.module.css";
import { Column } from "./Column";
import { Header } from "./Header";
import { store, useBoard } from './store';

export function Board() {
  const { isEditable, board, statusses } = useBoard();

  return (
    <>
      <Header />
      <br />

      <main className={styles.grid}>
        <DropArea id={0} onDrop={store.shiftColumn} disabled={!isEditable} />

        {board?.columns.map((column, idx) => (
          <Fragment key={column.name}>
            <Column idx={idx} name={column.name} />
            <DropArea id={idx + 1} onDrop={store.shiftColumn} disabled={!isEditable} />
          </Fragment>
        ))}

        <div className={styles.statusList}>
          <ul>
            {isEditable
              ? statusses?.filter((s) => board?.columns.every(c => c.status !== s.name)).map(({ name }) => (
                <li key={name} onClick={() => store.addColumn(name)}>
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
