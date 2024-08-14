import useQuery from "../../../hooks/useQuery";
import { ID, IIssue, IIssueFilters } from "../types";
import { filterIssues, generateIssues } from "../utils";
import { HOST } from "./host";

const tasks = generateIssues(200);

const useTasks = (projectId: ID, params?: IIssueFilters) =>
  useQuery<IIssue[]>(HOST + `projects/${projectId}/issues`, {
    fallback: !params ? tasks : filterIssues(tasks, params),
  });

export const useEpicTasks = (
  projectId: ID,
  params: Pick<IIssueFilters, "epicId">
) => useTasks(projectId, params);

export const useBacklogTasks = (
  projectId: ID,
  params?: Pick<IIssueFilters, "epicId">
) => useTasks(projectId, { ...params, sprintId: null });

export const useSprintTasks = (
  projectId: ID,
  sprintId: ID,
  params?: Pick<IIssueFilters, "assigneeId" | "type" | "priority" | "tag">
) => useTasks(projectId, { ...params, sprintId });
