import { useCallback, useEffect, useRef, useState } from "react";
import { tryUnmarshal } from "../utils/tryUnmarshal";

export type Options<DataType> = {
  type: "websocket" | "sse";
  onConnect?: (ev: Event) => void;
  onDisconnect?: () => void;
  onMessage?: (data: DataType, id?: string) => void;
  onError?: (ev: Event) => void;
  event?: string;
  protocols?: string | string[];
  withCredentials?: boolean;
  attempts?: number;
  preventConnection?: boolean;
};

export default function useSubscription<DataType = unknown>(
  url: string | URL,
  options: Options<DataType>
) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<DataType>();
  const memoizedOptions = useRef<typeof options>(options);
  const source = useRef<EventSource | WebSocket>();
  const connectionAttempts = useRef(0);

  const sendMessage = useCallback((data: any) => {
    if (!source.current) return;
    if (source.current.readyState !== source.current.OPEN) return;
    if (!("send" in source.current!)) return;

    const finalData = typeof data === "object" ? JSON.stringify(data) : data;
    source.current.send(finalData);
  }, []);

  const disconnect = useCallback((checkAttempts = false) => {
    if (!source.current) return;

    if (!checkAttempts) connectionAttempts.current = 0;
    source.current.close();
    source.current = undefined; // we no need manual removeEventListeners now
    memoizedOptions.current?.onDisconnect?.();
    setIsConnected(false);
  }, []);

  const connect = useCallback(
    (checkAttempts = false) => {
      if (source.current && source.current.readyState === source.current.OPEN) {
        return;
      }

      const {
        type,
        event,
        attempts = 1,
        protocols,
        withCredentials,
        onError,
        onConnect,
        onMessage,
      } = memoizedOptions.current || {};

      if (checkAttempts && connectionAttempts.current == attempts) {
        return;
      }

      connectionAttempts.current += 1;

      if (type === "websocket") {
        source.current = new WebSocket(url, protocols);
      } else {
        source.current = new EventSource(url, { withCredentials });
      }

      source.current.addEventListener("open", (ev) => {
        if (!source.current) return;
        connectionAttempts.current = 0;
        setIsConnected(true);
        onConnect?.(ev);
      });

      source.current.addEventListener(event || "message", (ev) => {
        if (!source.current) return;
        const { data, lastEventId } = ev as MessageEvent<any>;

        const finalData: DataType =
          typeof data === "string" ? tryUnmarshal(data) : data;
        if (onMessage) onMessage(finalData, lastEventId);
        else setLastMessage(finalData);
      });

      source.current.addEventListener("error", (ev) => {
        if (!source.current) return;
        disconnect(true);
        connect(true);
        onError?.(ev);
      });
    },
    [url, disconnect]
  );

  useEffect(() => {
    if (memoizedOptions.current?.preventConnection) return;

    const handleOnlineReconnect = () => {
      if (source.current) return;
      connectionAttempts.current = 0;
      connect(true);
    };
    window.addEventListener("online", handleOnlineReconnect);

    connect(true);

    return () => {
      disconnect();
      window.removeEventListener("online", handleOnlineReconnect);
    };
  }, [disconnect, connect]);

  return {
    isConnected,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
  } as const;
}
