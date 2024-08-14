export type ID = string;

export interface IUserPreview {
  id: ID;
  fullname: string;
  image?: string;
}

export interface ISprint {
  id: ID;
  projectId: ID;
  name: string;
  startAt: string;
  endAt: string;
}

export interface IBoardColumn {
  status: string;
  name: string;
  issueOrder: Record<ID, number>;
}

export interface IBoard {
  id: ID;
  projectId: ID;
  name: string;
  columns: IBoardColumn[];
  filter?: string;
}

export enum IssueType {
  EPIC = "EPIC",
  STORY = "STORY",
  TASK = "TASK",
  BUG = "BUG",
}

export enum IssuePriority {
  TRIVIAL = "TRIVIAL",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
  BLOCKER = "BLOCKER",
}

export enum IssueRelation {
  RELATE = "RELATE",
  BLOCK = "BLOCK",
  DUPLICATE = "DUPLICATE",
  CAUSE = "CAUSE",
}

export interface IIssueStatus {
  name: string;
  transitions: string[];
}

export interface IIssue {
  id: ID;
  projectId: ID;
  type: IssueType;
  name: string;
  title: string;
  tags?: string[];
  status?: IIssueStatus;
  priority?: IssuePriority;
  assignee?: IUserPreview;
  points?: number;
  sprintId?: ID;
  epicId?: ID;
  startAt?: string;
  endAt?: string;
  progress?: number;
  version?: number;
}

export type IIssueFilters = Partial<{
  type: IssueType;
  priority: IssuePriority;
  tag: string;
  assigneeId: ID;
  epicId: ID;
  sprintId: ID | null;
}>;
// /projects
// /projects/1

// board:
// 1. current_sprint?, group_by_epics
// 2. /issues?type=!epic&sprintId=
// gantt: 1.epic{...,stories}[], 1.sprints[]
// 1. sprints
// 2. /issues?type=epic, /issues?type=story&epicId=
// backlog:filter_by_epics):
// 1.sprint{current/future}[]
// 2. /issues?type=!epic&sprint=nill&  free_issue{non_epic}[]
// 3.issue{current_sprint/board}
