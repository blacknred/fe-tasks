import { Dispatch, memo, SetStateAction, useEffect, useState } from "react";
import styles from "./WhackAMolly.module.css";

export type BoardProps = {
  capacity: number;
  level?: number;
  setScore: Dispatch<SetStateAction<number>>;
};

export const Board = memo(({ capacity, level = 1, setScore }: BoardProps) => {
  const [position, setPosition] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) setPosition(null);
      else setPosition(Math.floor(Math.random() * capacity));
    }, 3000 / level);

    return () => clearInterval(interval);
  }, [level]);

  return (
    <div className={styles.grid}>
      {Array(capacity)
        .fill(0)
        .map((_, idx) => (
          <button
            key={idx}
            className={position === idx ? styles.active : ""}
            onClick={(e) => {
              if (position !== idx) return;
              setScore((prev) => prev + 1);
              e.target.disabled = true;
            }}
          />
        ))}
    </div>
  );
});
