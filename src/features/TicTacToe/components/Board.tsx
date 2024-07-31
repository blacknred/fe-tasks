import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { IBoard } from "../types";
import { getRandomEmptyIndex } from "../utils";

type BoardProps = { capacity: number; onCheck: (board: IBoard) => void };

export const Board = forwardRef(({ capacity, onCheck }: BoardProps, ref) => {
  const [board, setBoard] = useState<IBoard>(() => Array(capacity).fill(null));
  const stepHistory = useRef<[number, IBoard[0]][]>([]);

  useImperativeHandle(ref, () => ({
    onUndo: () => {
      const step = stepHistory.current?.shift();
      if (!step) return;
      setBoard((prev) => {
        prev[step[0]] = null;
        return [...prev];
      });
    },
  }));

  useEffect(() => {
    onCheck(board);

    if (!stepHistory.current.length) {
      if (Math.random() > 0.5) return;
    } else if (stepHistory.current[0][1] === "0") {
      return;
    }

    const idx = getRandomEmptyIndex(board);

    setBoard((prev) => prev.map((v, i) => (i === idx ? "0" : v)));
    stepHistory.current.unshift([idx, "0"]);
  }, [board, onCheck]);

  return (
    <>
      <div>
        {board.map((value, idx) => (
          <button
            key={idx}
            disabled={!!value}
            onClick={() => {
              stepHistory.current.unshift([idx, "X"]);
              setBoard((prev) => prev.map((v, i) => (i === idx ? "X" : v)));
            }}
          >
            {value}
          </button>
        ))}
      </div>
      <ul>
        {stepHistory.current.map((step) => (
          <li key={step[0]}>
            <p>
              {step[0]} - {step[1]}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
});
