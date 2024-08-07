import { useContext } from "react";
import { RouterContext } from "./RouterContext";

/**
 * Returns an object containing the parameters from the current URL's query string.
 *
 * @return {Object} An object with key-value pairs representing the parameters.
 */
export function useParams() {
  useContext(RouterContext);

  return Object.fromEntries(new URLSearchParams(window.location.search));
}
