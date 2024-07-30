import useQuery from "../../hooks/useQuery";
import type { IComment } from "./types";

const HOST = "https://jsonplaceholder.typicode.com/comments";

export const useComments = () =>
  useQuery<IComment[]>(HOST, {
    onError: console.log,
    interceptor: undefined,
  });
