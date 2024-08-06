import useSubscription, { Options } from "../../hooks/useSubscription";
import { ISensor } from "./types";
import { generateSensorEntry } from "./utils";

const HOST = "https://echo.websocket.org/.sse";

export const useSensors = (options: Pick<Options<ISensor>, "onMessage">) =>
  useSubscription<ISensor>(HOST, {
    onError: console.error,
    event: "time",
    type: "sse",
    ...options,
    onMessage: (data, id) => {
      if (Math.random() > 0.06) return;
      options.onMessage?.(generateSensorEntry(id!, data as unknown as string));
    },
  });
