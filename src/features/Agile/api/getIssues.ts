import useQuery from "../../../hooks/useQuery";
import { ID, IIssue, IIssueFilters, IssueType } from "../types";
import { filterIssues } from "../utils";
import { DB } from "./db";
import { HOST } from "./host";

const useIssues = (projectId: ID, params: IIssueFilters = {}) =>
  useQuery<IIssue[]>(
    // @ts-ignore
    HOST + `projects/${projectId}/issues?${new URLSearchParams(params)}`,
    {
      fallback: DB.findIssues(params),
    }
  );

export const useEpics = (projectId: ID, params?: IIssueFilters) =>
  useIssues(projectId, { ...params, type: IssueType.EPIC });

export const useEpicStories = useIssues;

export const useBacklogStories = (projectId: ID, params?: IIssueFilters) =>
  useIssues(projectId, { ...params, sprintId: null, type: IssueType.STORY });

export const useSprintIssues = (projectId: ID, params?: IIssueFilters) =>
  useQuery<IIssue[]>(
    // @ts-ignore
    HOST + `projects/${projectId}/issues?${new URLSearchParams(params)}`,
    {
      fallback: filterIssues(DB.issues, {
        ...params,
        sprintId: params?.sprintId || DB.findActiveSprint()?.id,
      }),
    }
  );
