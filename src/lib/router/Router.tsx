import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { RouterContext } from "./RouterContext";

/**
 * Router component that manages the current path and provides it to its children.
 *
 * @param {PropsWithChildren} children - The child components to render.
 * @return {JSX.Element} The rendered Router component.
 */
export function Router({ children }: PropsWithChildren) {
  const [path, setPath] = useState(window.location.pathname);
  const needFallback = useRef(true);

  useEffect(() => {
    const { proxy, revoke } = Proxy.revocable(window.history.pushState, {
      apply(
        target,
        thisArg,
        argArray: Parameters<typeof window.history.pushState>
      ) {
        if (argArray[2]) setPath(argArray[2] as string);
        target.apply(thisArg, argArray);
      },
    });

    window.history.pushState = proxy;
    return () => revoke();
  }, []);

  useEffect(() => {
    if (needFallback.current) {
      window.history.pushState(null, "", "/");
    }
  }, [path]);

  return (
    <RouterContext.Provider value={{ path, needFallback }}>
      {children}
    </RouterContext.Provider>
  );
}
