import { useCallback, useEffect, useRef, useState } from "react";

const TIMEOUT = 10000;

export type Options<DataType, ErrorType> = RequestInit & {
  interceptor?: (data: any) => DataType;
  onError?: (err: ErrorType) => void;
  contentType?: "json" | "text" | "blob";
  refetchInterval?: number;
  attempts?: number;
  fallback?: DataType;
  log?: boolean;
};

export default function useQuery<DataType = unknown, ErrorType = unknown>(
  url: RequestInfo | URL,
  options?: Options<DataType, ErrorType>
) {
  const [data, setData] = useState<DataType>();
  const [error, setError] = useState<ErrorType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const memoizedOptions = useRef<typeof options>(options);
  const isMounted = useRef(true);

  const fetcher = useCallback(
    async function (invalidate = false) {
      const {
        onError,
        interceptor,
        contentType = "json",
        refetchInterval,
        attempts = 1,
        fallback,
        log = false,
        ...init
      } = memoizedOptions.current || {};

      if (!init.signal) init.signal = AbortSignal.timeout(TIMEOUT);
      isMounted.current = true;
      let attempt = 0;

      if (invalidate) setIsLoading(true);

      while (attempt < attempts) {
        try {
          const res = await fetch(url, init);

          if (!isMounted.current) return;
          const data = await res[contentType]?.();

          if (!res.ok) {
            setError(data as ErrorType);
            onError?.(data as ErrorType);
          } else if (interceptor) {
            setData(interceptor(data));
          } else {
            setData(data as DataType);
            if (!log) return;
            if (Array.isArray(data)) {
              console.table(data);
            } else {
              console.log(data);
            }
          }
          break;
        } catch (err) {
          if (!isMounted.current) return;
          if (fallback !== undefined) setData(fallback);
          if (log) console.error(err);
          onError?.(err as ErrorType);
        } finally {
          attempt++;
        }
      }

      if (invalidate) setIsLoading(false);
    },
    [url, memoizedOptions, isMounted]
  );

  useEffect(() => {
    fetcher(true);

    let interval: NodeJS.Timeout;
    const { refetchInterval } = memoizedOptions.current || {};

    const handleVisibilityRefetch = () => !document.hidden && fetcher(false);
    window.document.addEventListener(
      "visibilitychange",
      handleVisibilityRefetch
    );

    const handleOnlineRefetch = () => fetcher(false);
    window.addEventListener("online", handleOnlineRefetch);

    if (refetchInterval) {
      interval = setInterval(fetcher, refetchInterval * 1000);
    }

    return () => {
      isMounted.current = false;
      if (interval) clearInterval(interval);
      window.removeEventListener("online", handleOnlineRefetch);
      window.document.removeEventListener(
        "visibilitychange",
        handleVisibilityRefetch
      );
    };
  }, [fetcher]);

  return [data, error, isLoading, fetcher] as const;
}
