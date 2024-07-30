import { memo, ReactNode, useEffect, useState } from "react";

export type TimerProps = {
  duration: number;
  isPaused: boolean;
  onEnd: () => void;
  children?: (value: number) => ReactNode;
};

export const Timer = memo(
  ({ duration, isPaused, onEnd, children }: TimerProps) => {
    const [secondsLeft, setSecondsLeft] = useState<number>(duration);

    useEffect(() => {
      const timeout = setInterval(() => {
        if (isPaused) return;
        setSecondsLeft((prev) => {
          if (prev - 1 === 0) {
            clearInterval(timeout);
            onEnd();
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timeout);
    }, [duration, isPaused, onEnd]);

    return children ? children(secondsLeft) : secondsLeft;
  }
);
