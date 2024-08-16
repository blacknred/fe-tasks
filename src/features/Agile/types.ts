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
  projectId: ID;
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
  assignee?: IUserPreview;
  startAt?: string;
  endAt?: string;
  progress?: number;
  version?: number;
  tags?: string[];

  status: IIssueStatus;
  priority?: IssuePriority;
  sprintId?: ID;
  points?: number;
  epicId?: ID;
}

export type IEpicIssue = Omit<IIssue, "type" | "priority" | "sprintId"> & {
  type: IssueType.EPIC;
};

export type IStoryIssue = Omit<IIssue, "type" | "points" | "epicId"> & {
  type: IssueType.STORY;
  points: number;
  epicId: ID;
};

export type IIssueFilters = Partial<{
  search: string;
  type: IssueType;
  priority: IssuePriority;
  tag: string;
  assigneeId: ID;
  epicId: ID;
  sprintId: ID | null;
}>;
