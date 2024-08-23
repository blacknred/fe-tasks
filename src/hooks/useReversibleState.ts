import { useCallback, useRef, useState } from "react";

export function useReversibleState<T>(defaultValue?: T) {
  const [state, set_state] = useState<T | undefined>(defaultValue);
  const stateHistory = useRef<T[]>([]);

  const setState = useCallback((value: T) => {
    set_state((prev) => {
      if (prev === value) return prev;
      if (prev) stateHistory.current.push(prev);
      return value;
    });
  }, []);

  const revert = useCallback((full = false) => {
    if (!stateHistory.current.length) return;

    setState(stateHistory.current.shift()!);
    if (full) stateHistory.current.length = 0;
  }, []);

  return [state, setState, revert] as const;
}
