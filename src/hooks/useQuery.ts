import { useCallback, useEffect, useRef, useState } from "react";

const TIMEOUT = 10000;

export type Options<DataType, ErrorType> = RequestInit & {
  interceptor?: (data: any) => DataType;
  onError?: (err: ErrorType) => void;
  contentType?: "json" | "text" | "blob";
  fallback?: DataType;
  attempts?: number;
  skipInitial?: boolean;
  refetchInterval?: number;
  watchOnline?: boolean;
  watchVisibility?: boolean;
};

export default function useQuery<DataType = unknown, ErrorType = unknown>(
  url: RequestInfo | URL,
  options?: Options<DataType, ErrorType>
) {
  const [data, setData] = useState<DataType>();
  const [error, setError] = useState<ErrorType>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const memoizedOptions = useRef<typeof options>(options);
  const optimisticDataStack = useRef<DataType[]>([]);

  if (options?.fallback !== memoizedOptions.current?.fallback) {
    memoizedOptions.current!.fallback = options?.fallback;
  }

  const isMounted = useRef(true);

  const refetch = useCallback(
    async function (reset = false) {
      const {
        onError,
        interceptor,
        contentType = "json",
        refetchInterval,
        attempts = 1,
        fallback,
        ...init
      } = memoizedOptions.current || {};

      if (!init.signal) init.signal = AbortSignal.timeout(TIMEOUT);
      isMounted.current = true;
      let attempt = 0;

      if (reset) setIsFetching(true);

      // if (!offline) {
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
          }

          optimisticDataStack.current.pop();
          break;
        } catch (err) {
          if (!isMounted.current) return;
          if (fallback !== undefined) setData(fallback);
          onError?.(err as ErrorType);
        } finally {
          attempt++;
        }
      }
      // }

      if (reset) setIsFetching(false);
    },
    [url, memoizedOptions, isMounted]
  );

  const mutate = useCallback(
    (optimisticData: DataType) => {
      setData((prev) => {
        if (prev) optimisticDataStack.current.push(prev);
        return optimisticData;
      });

      return (full = false) => {
        if (full) {
          const state = optimisticDataStack.current.shift();
          if (!state) return;
          setData(state);
          optimisticDataStack.current.length = 0;
        } else {
          const state = optimisticDataStack.current.pop();
          if (state) setData(state);
        }
      };
    },
    [refetch]
  );

  useEffect(() => {
    const { skipInitial, refetchInterval, watchOnline, watchVisibility } =
      memoizedOptions.current || {};

    if (!skipInitial) refetch(true);

    let interval: NodeJS.Timeout;

    const handleVisibilityRefetch = () => !document.hidden && refetch();
    if (watchVisibility) {
      window.document.addEventListener(
        "visibilitychange",
        handleVisibilityRefetch
      );
    }

    const handleOnlineRefetch = () => refetch();
    if (watchOnline) {
      window.addEventListener("online", handleOnlineRefetch);
    }

    if (refetchInterval) {
      interval = setInterval(refetch, refetchInterval * 1000);
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
  }, [refetch]);

  return { data, error, isFetching, refetch, mutate } as const;
}
