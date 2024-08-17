import { useMemo } from "react";
import useQuery from "../../../hooks/useQuery";
import { ID, IIssue, IIssueFilters, IssueType } from "../types";
import {
  filterIssues,
  findCurrentSprint,
  generateIssues,
  prepareIssuesForBoard,
} from "../utils";
import { board } from "./getBoard";
import { sprints } from "./getSprints";
import { HOST } from "./host";

export const issues = generateIssues(200);

const useIssues = (projectId: ID, params: IIssueFilters = {}) =>
  useQuery<IIssue[]>(HOST + `projects/${projectId}/issues`, {
    fallback: filterIssues(issues, params),
  });

export const useEpics = (projectId: ID, params?: IIssueFilters) =>
  useIssues(projectId, { ...params, type: IssueType.EPIC });

export const useEpicStories = (
  projectId: ID,
  epicId: ID,
  params?: IIssueFilters
) => useIssues(projectId, { ...params, epicId });

export const useBacklogStories = (projectId: ID, params?: IIssueFilters) =>
  useIssues(projectId, { ...params, sprintId: null });

export const useSprintIssues = (
  projectId: ID,
  sprintId: ID,
  params?: IIssueFilters
) => useIssues(projectId, { ...params, sprintId });

export const useBoardIssues = (projectId: ID, params?: IIssueFilters) => {
  const [data, ...rest] = useSprintIssues(
    projectId,
    findCurrentSprint(sprints),
    params
  );

  const issues = useMemo(
    () => (!data ? data : prepareIssuesForBoard(data, board.columns)),
    [data]
  );

  return [issues, ...rest] as const;
};
