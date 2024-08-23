import { useEffect, useMemo, useRef, useState } from "react";
import useSubscription from "../../../hooks/useSubscription";
import { IBoard, IIssue } from "../types";
import { getEpicsFromIssues, prepareIssuesForBoard } from "../utils";
import { DB } from "./db";
import { useSprintIssues } from "./getIssues";
import { WSHOST } from "./host";

export const useBoardIssues = (board: IBoard) => {
  const { data: issues, ...rest } = useSprintIssues(board.projectId);

  const epics = useMemo(
    () => (issues ? getEpicsFromIssues(issues) : []),
    [issues]
  );

  const [data, setData] = useState<Record<string, IIssue[]>>({});
  useEffect(
    () => issues && setData(prepareIssuesForBoard(issues, board.columns)),
    [issues]
  );

  let unsubscribe = useRef<() => void>();
  const subscription = useSubscription<IIssue>(WSHOST, {
    type: "websocket",
    onConnect() {
      unsubscribe.current = DB.subscribe(subscription, board.id);
    },
    onDisconnect: unsubscribe.current,
    onMessage(data, id) {
      setData((prev) => {
        if (!prev) return prev;
        const issues = Object.values(prev).flat();
        const idx = issues.findIndex((issue) => data.id === issue.id);
        if (idx === -1) issues.push(data);
        else issues[idx] = data;
        return prepareIssuesForBoard(issues, board.columns);
      });
    },
  });

  return { ...rest, data, epics, ...subscription } as const;
};
