import { createContext, MutableRefObject } from "react";

export const RouterContext = createContext<{
  path: string;
  needFallback: MutableRefObject<boolean>;
} | null>(null);
