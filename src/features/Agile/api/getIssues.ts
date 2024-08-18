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
  useQuery<IIssue[]>(
    // @ts-ignore
    HOST + `projects/${projectId}/issues?${new URLSearchParams(params)}`,
    {
      fallback: filterIssues(issues, params),
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
      fallback: filterIssues(issues, {
        ...params,
        sprintId: params?.sprintId || findCurrentSprint(sprints),
      }),
      skipInitial: params?.sprintId === undefined,
    }
  );

export const useBoardIssues = (projectId: ID, params?: IIssueFilters) =>
  useQuery<Record<string, IIssue[]>>(
    // @ts-ignore
    HOST + `projects/${projectId}/issues?${new URLSearchParams(params)}`,
    {
      fallback: prepareIssuesForBoard(
        filterIssues(issues, {
          ...params,
          sprintId: findCurrentSprint(sprints),
        }),
        board.columns
      ),
    }
  );
