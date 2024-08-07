import { useRef, useEffect, useState } from "react";

export function useOnViewport(
  onIntersect?: (v: boolean) => any,
  options: IntersectionObserverInit = {
    rootMargin: "0px 0px 0px 0px",
    threshold: [0, 1],
    root: null,
  }
) {
  const memoizedCallback = useRef(onIntersect);
  const memoizedOptions = useRef<typeof options>(options);
  const ref = useRef<HTMLElement | null>(null);

  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        memoizedCallback.current?.(entry.isIntersecting);
        setIntersecting(entry.isIntersecting);
      },
      memoizedOptions.current
    );

    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting] as const;
}
