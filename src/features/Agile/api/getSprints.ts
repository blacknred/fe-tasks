import useQuery from "../../../hooks/useQuery";
import { ID, ISprint } from "../types";
import { DB } from "./db";
import { HOST } from "./host";

export const useSprints = (projectId: ID) =>
  useQuery<ISprint[]>(HOST + `projects/${projectId}/sprints`, {
    fallback: DB.sprints,
  });

export const useActiveSprint = (projectId: ID) =>
  useQuery<ISprint | undefined>(HOST + `projects/${projectId}/sprints/active`, {
    fallback: DB.findActiveSprint(),
  });
