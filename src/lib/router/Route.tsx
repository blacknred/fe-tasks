import { ReactElement, useContext } from "react";
import { RouterContext } from "./RouterContext";

export type RouteProps = {
  path: string;
  element: ReactElement;
};

/**
 * Renders the given element if the current path matches the provided path.
 *
 * @param {RouteProps} props - The route props.
 * @param {string} props.path - The path to match.
 * @param {ReactElement} props.element - The element to render.
 * @return {ReactElement | null} The rendered element or null if the path doesn't match.
 */
export function Route({ path, element }: RouteProps) {
  const ctx = useContext(RouterContext);

  if (ctx?.path.split('?')[0] !== path) return null;
  if (ctx) ctx.needFallback.current = false;

  return element;
}
