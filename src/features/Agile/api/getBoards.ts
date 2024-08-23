import { SetStateAction, useCallback, useEffect, useState } from "react";
import useQuery from "../../../hooks/useQuery";
import { IBoard, ID } from "../types";
import { HOST } from "./host";
import { DB } from "./db";

export const useBoards = (projectId: ID) => {
  const res = useQuery<IBoard[]>(HOST + `projects/${projectId}/board`, {
    fallback: DB.boards,
    watchOnline: true,
    watchVisibility: true,
  });

  const [data, setData] = useState(res.data);

  useEffect(() => setData(res.data), [res.data]);

  const setBoard = useCallback(
    (idx: number) => (action: SetStateAction<IBoard>) => {
      setData((prev) => {
        if (!prev) return prev;
        prev[idx] = typeof action === "function" ? action(prev[idx]) : action;
        return [...prev];
      });
    },
    []
  );

  return { ...res, data, setData: setBoard } as const;
};
