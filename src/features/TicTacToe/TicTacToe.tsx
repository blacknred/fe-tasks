import { useCallback, useRef, useState } from "react";
import { Board } from "./components/Board";
import styles from "./TicTacToe.module.css";
import { IBoard } from "./types";
import { findWonStrategy, STRATEGIES } from "./utils";

export type TicTacToeProps = {
  capacity?: number;
};

export function TicTacToe({ capacity = 9 }: TicTacToeProps) {
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(0);
  const boardRef = useRef<{ onUndo: () => void }>();
  const win = useRef<{
    winner: IBoard[0];
    strategy: (typeof STRATEGIES)[number][number];
  }>();

  const handleCheck = useCallback((board: IBoard) => {
    if (!board.length) return;

    if (board.every(Boolean)) {
      setStatus(2);
      return;
    }

    const wonStrategy = findWonStrategy(board, capacity);
    if (!wonStrategy) return;

    win.current = { winner: board[wonStrategy[0]], strategy: wonStrategy };
    setStatus(1);
  }, []);

  return (
    <>
      <h1>Tic Tac Toe</h1>
      <header className={styles.header}>
        {status === 0 ? (
          <button onClick={() => boardRef.current?.onUndo()}>Undo</button>
        ) : (
          <button onClick={() => setStatus(0)}>Again</button>
        )}
      </header>
      <br />
      <main className={styles.main}>
        {status === 0 && (
          <Board ref={boardRef} capacity={capacity} onCheck={handleCheck} />
        )}
        {status > 0 && (
          <>
            {status === 1 ? (
              <>
                <h2>Winner: {win.current?.winner}!</h2>
                <p>strategy: {win.current?.strategy}</p>
              </>
            ) : (
              <h1>Draw!</h1>
            )}
          </>
        )}
      </main>
    </>
  );
}
