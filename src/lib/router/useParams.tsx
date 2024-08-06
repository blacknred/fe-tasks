import { useContext } from "react";
import { RouterContext } from "./RouterContext";

export function useParams() {
  useContext(RouterContext);

  return Object.fromEntries(new URLSearchParams(window.location.search));
}
