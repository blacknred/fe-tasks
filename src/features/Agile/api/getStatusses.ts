import useQuery from "../../../hooks/useQuery";
import { ID, IIssueStatus } from "../types";
import { DB } from "./db";
import { HOST } from "./host";

export const useStatusses = (projectId: ID) =>
  useQuery<IIssueStatus[]>(HOST + `projects/${projectId}/statusses`, {
    fallback: DB.statusses,
  });
