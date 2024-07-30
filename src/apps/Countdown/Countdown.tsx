import { useEffect, useState, useRef } from "react";
import styles from "./Countdown.module.css";

export function Countdown() {
  const [isStarted, setIsStarted] = useState(false);
  const [counter, setCounter] = useState(0);
  const timer = useRef<number>(0);
  const snapshots = useRef<number[]>([]);

  useEffect(() => {
    if (isStarted && !timer.current) {
      timer.current = setInterval(() => setCounter((prev) => prev + 1), 1000);
    } else if (!isStarted && timer.current) {
      clearInterval(timer.current);
      timer.current = 0;
    }

    return () => clearInterval(timer.current);
  }, [isStarted]);

  return (
    <>
      <h1>Countdown</h1>
      <header className={styles.header}>
        <button
          disabled={!counter}
          onClick={() => {
            snapshots.current = [];
            setCounter(0);
          }}
        >
          Reset
        </button>
        <button onClick={() => setIsStarted(!isStarted)}>
          {isStarted ? "Stop" : "Start"}
        </button>
        <button
          disabled={!isStarted}
          onClick={() => snapshots.current.push(counter)}
        >
          Snapshot
        </button>
      </header>

      <br />
      <main className={styles.main}>
        <p>{counter}</p>
        <ul>
          {snapshots.current.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
