import useQuery from "../../../hooks/useQuery";
import { ID, IIssue } from "../types";
import { generateIssues } from "../utils";
import { HOST } from "./host";

export const useEpics = (projectId: ID) =>
  useQuery<IIssue[]>(HOST + `projects/${projectId}/epics`, {
    fallback: generateIssues(5, true),
  });
