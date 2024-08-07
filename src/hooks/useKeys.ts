import { useEffect, useRef } from "react";

export function useKeys(
  shortcut: string,
  onFire: () => void,
  ignoreOrder = false
) {
  const keys = useRef<string[]>(shortcut.toLowerCase().split(" "));
  const memoizedCallback = useRef(onFire);
  const temp = useRef<string[]>([]);

  useEffect(() => {
    function handleDown({ key }: KeyboardEvent) {
      key = key.toLowerCase();

      if (keys.current.includes(key)) {
        temp.current.push(key);
      }
    }

    function handleUp({ key }: KeyboardEvent) {
      key = key.toLowerCase();

      if (!keys.current.includes(key)) return;

      // 1 key shortcut
      if (keys.current.length === 1) {
        memoizedCallback.current();
        temp.current = [];
        return;
      }

      // n keys shortcut
      const isReady = keys.current.every((k, i) =>
        ignoreOrder ? temp.current[i] === k : temp.current.includes(k)
      );

      if (isReady) memoizedCallback.current();
      const index = temp.current.findIndex((sKey) => sKey === key);
      temp.current = temp.current.slice(0, index);
    }

    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);

    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
  }, []);
}

// Usage
// useKeys("a", () => console.log("a"));
// useKeys("control shift x", () => console.log("control shift x"));
// useKeys("control shift x", () => console.log("control shift x in order"), true);
