import { useCallback, useEffect, useRef, useState } from "react";
import { useReversibleState } from "./useReversibleState";

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
  const [data, setData, revert] = useReversibleState<DataType>();
  const [error, setError] = useState<ErrorType>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const memoizedOptions = useRef<typeof options>(options);
  const isMounted = useRef(true);

  const refetch = useCallback(
    async function ({
      reset = false,
      optimisticData,
    }: { reset?: boolean; optimisticData?: DataType } = {}) {
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
      if (optimisticData) setData(optimisticData);

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

          break;
        } catch (err) {
          if (!isMounted.current) return;
          if (attempt + 1 < attempts) return;

          if (optimisticData) revert();
          if (fallback !== undefined) setData(fallback);
          onError?.(err as ErrorType);
        } finally {
          attempt++;
        }
      }

      if (reset) setIsFetching(false);
    },
    [url, memoizedOptions, isMounted]
  );

  useEffect(() => {
    const { skipInitial, refetchInterval, watchOnline, watchVisibility } =
      memoizedOptions.current || {};

    if (!skipInitial) refetch({ reset: true });

    let interval: NodeJS.Timeout;

    const handleVisibilityRefetch = () => {
      if (document.hidden) refetch();
    };
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
      if (watchOnline) {
        window.removeEventListener("online", handleOnlineRefetch);
      }
      if (watchVisibility) {
        window.document.removeEventListener(
          "visibilitychange",
          handleVisibilityRefetch
        );
      }
    };
  }, [refetch]);

  // const experimental_mutate = useCallback(
  //   (optimisticData: DataType) => {
  //     setData(optimisticData);
  //     return revert;
  //   },
  //   [revert]
  // );

  return { data, error, isFetching, refetch } as const;
}
