import { useRef } from "react";
import useSubscription from "../../../hooks/useSubscription";
import { IPlanePosition, IPositionBoundaries } from "../types";
import { planePositionGenerator } from "../utils";

const HOST = "https://echo.websocket.org/.ws";

export const usePlanePositions = (boundaries: IPositionBoundaries) => {
  let timer = useRef<NodeJS.Timeout>();

  const subscription = useSubscription<IPlanePosition[]>(HOST, {
    type: "websocket",
    onError: console.error,
    onConnect() {
      const generator = planePositionGenerator(boundaries);

      timer.current = setInterval(() => {
        subscription.sendMessage?.(generator.next().value);
      }, 1000);
    },
    onDisconnect() {
      clearInterval(timer.current);
    },
  });

  if (typeof subscription.lastMessage === "string") {
    return { ...subscription, lastMessage: undefined };
  }

  return subscription;
};
