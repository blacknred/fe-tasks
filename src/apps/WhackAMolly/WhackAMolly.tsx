import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Board } from "./Board";
import { Timer } from "./Timer";
import { CELLS_COUNT, DURATION } from "./utils";
import styles from "./WhackAMolly.module.css";

export type WhackAMollyProps = {
  capacity?: number;
};

export function WhackAMolly({ capacity = 64 }: WhackAMollyProps) {
  const [status, setStatus] = useState<0 | 1 | 2>(0);
  const [score, setScore] = useState<number>(0);

  const bestScore = useRef<number>(0);
  const level = useRef<1 | 2 | 3>(1);

  useEffect(() => {
    const lastBestScore = localStorage.getItem("bestScore");
    if (lastBestScore) bestScore.current = +lastBestScore;

    return () => localStorage.setItem("bestScore", bestScore.current + "");
  }, [bestScore]);

  const handleEnd = useCallback(() => {
    setStatus(0);
    setScore((prev) => {
      if (prev > bestScore.current) {
        bestScore.current = prev;
      }
      return prev;
    });
  }, []);

  return (
    <>
      <h1>Whack A Molly</h1>
      <header className={styles.header}>
        {status === 0 ? (
          <>
            <label htmlFor="level">Level</label>
            <select onChange={(e) => (level.current = e.target.value)}>
              <option value="1" defaultChecked>
                1
              </option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </>
        ) : (
          <>
            <span>
              score: {score} / best: {bestScore.current} / level:{" "}
              {level.current}
            </span>
            <span>
              left:{" "}
              <Timer
                duration={DURATION}
                isPaused={status === 2}
                onEnd={handleEnd}
              />
              sec
            </span>
          </>
        )}

        <button
          onClick={() => {
            if (!status) {
              setScore(0);
              setStatus(1);
            } else {
              setStatus(status === 1 ? 2 : 1);
            }
          }}
        >
          {!status ? "Start" : status === 1 ? "Paused" : "Resume"}
        </button>
        {status > 0 && (
          <button
            onClick={() => {
              setScore(0);
              setStatus(0);
            }}
          >
            End
          </button>
        )}
      </header>
      <br />
      <main>
        {status === 0 && !!score && <h2>Your score: {score}</h2>}
        {status === 1 && (
          <Board
            capacity={capacity}
            setScore={setScore}
            level={level.current}
          />
        )}
        {status === 2 && <h1>Paused...</h1>}
      </main>
    </>
  );
}
