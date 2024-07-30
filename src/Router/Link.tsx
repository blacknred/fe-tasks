import { PropsWithChildren } from "react";

export type LinkProps = PropsWithChildren<{
  path: string;
  state?: Record<string, unknown>;
}>;

export function Link({ path, state, children }: LinkProps) {
  return (
    <a
      href="#"
      children={children}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState(state, null, path);
      }}
    />
  );
}
