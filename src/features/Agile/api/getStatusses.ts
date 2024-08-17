import useQuery from "../../../hooks/useQuery";
import { ID, IIssueStatus } from "../types";
import { generateStatusses } from "../utils";
import { HOST } from "./host";

export const statusses = generateStatusses();

export const useStatusses = (projectId: ID) =>
  useQuery<IIssueStatus[]>(HOST + `projects/${projectId}/statusses`, {
    fallback: statusses,
  });
