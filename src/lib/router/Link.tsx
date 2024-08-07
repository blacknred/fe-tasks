import { PropsWithChildren } from "react";

export type LinkProps = PropsWithChildren<{
  path: string;
  state?: Record<string, unknown>;
}>;

/**
 * Renders a link component that updates the browser history when clicked.
 *
 * @param {LinkProps} props - The props for the Link component.
 * @param {string} props.path - The path to navigate to when the link is clicked.
 * @param {Record<string, unknown>} [props.state] - The state object to be stored in the browser history.
 * @param {ReactNode} props.children - The content of the link.
 * @return {JSX.Element} The rendered link component.
 */
export function Link({ path, state, children }: LinkProps) {
  return (
    <a
      href="#"
      children={children}
      onClick={(e) => {
        e.preventDefault();
        window.history.pushState(state, "", path);
      }}
    />
  );
}
