import { PropsWithChildren, useEffect, useState, useRef } from "react";
import { RouterContext } from "./RouterContext";

export function Router({ children }: PropsWithChildren) {
  const [path, setPath] = useState(window.location.pathname);
  const needFallback = useRef(true);

  useEffect(() => {
    const { proxy, revoke } = Proxy.revocable(window.history.pushState, {
      apply(target, thisArg, argArray) {
        if (argArray[2]) setPath(argArray[2]);
        target.apply(thisArg, argArray);
      },
    });

    window.history.pushState = proxy;
    return () => revoke();
  }, []);

  useEffect(() => {
    if (needFallback.current) {
      window.history.pushState(null, null, "/");
    }
  }, [path]);

  return (
    <RouterContext.Provider value={{ path, needFallback }}>
      {children}
    </RouterContext.Provider>
  );
}
