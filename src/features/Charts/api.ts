import useSubscription, { Options } from "../../hooks/useSubscription";

const HOST = "https://echo.websocket.org/.sse";

export const useSensors = (options: Pick<Options<string>, "onMessage">) =>
  useSubscription<string>(HOST, {
    onError: console.error,
    event: "time",
    type: "sse",
    ...options,
  });
