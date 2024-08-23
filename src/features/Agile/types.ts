export type ID = string;

export interface IProfile {
  id: ID;
  fullname: string;
  image?: string;
}

export interface ISprint {
  id: ID;
  projectId: ID;
  name: string;
  startAt: number;
  endAt: number;
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
  type: "scrum" | "kanban";
  columns: IBoardColumn[];
  filters?: IIssueFilters;
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
  title: string;
  assignee?: IProfile;
  startAt?: number;
  endAt?: number;
  progress?: number;
  version?: number;
  tags?: string[];

  status: string;
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

export type IIssueFilters = Partial<
  Pick<IIssue, "type" | "priority" | "epicId" | "startAt" | "endAt">
> & {
  tag?: string;
  search?: string;
  assigneeId?: ID;
  sprintId?: ID | null;
};
