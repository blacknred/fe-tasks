import { ReactElement, useContext } from "react";
import { RouterContext } from "./RouterContext";

export type RouteProps = {
  path: string;
  element: ReactElement;
};

export function Route({ path, element }: RouteProps) {
  const ctx = useContext(RouterContext);

  if (ctx?.path !== path) return null;
  if (ctx) ctx.needFallback.current = false;

  return element;
}
