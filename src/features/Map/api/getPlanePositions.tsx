import { useRef } from "react";
import useSubscription from "../../../hooks/useSubscription";
import { IPlanePosition, IPositionBoundaries } from "../types";
import { DB } from "./db";

const HOST = "https://echo.websocket.org/.ws";

export const usePlanePositions = (boundaries: IPositionBoundaries) => {
  let unsubscribe = useRef<() => void>();

  const subscription = useSubscription<IPlanePosition[]>(HOST, {
    type: "websocket",
    onConnect() {
      unsubscribe.current = DB.subscribe(subscription, boundaries);
    },
    onDisconnect: unsubscribe.current
  });

  if (typeof subscription.lastMessage === "string") {
    return { ...subscription, lastMessage: undefined };
  }

  return subscription;
};
