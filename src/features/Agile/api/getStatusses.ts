import useQuery from "../../../hooks/useQuery";
import { ID } from "../types";
import { STATUSSES } from "../utils";
import { HOST } from "./host";

export const statusses = STATUSSES;

export const useStatusses = (projectId: ID) =>
  useQuery<string[]>(HOST + `projects/${projectId}/statusses`, {
    fallback: statusses,
  });
