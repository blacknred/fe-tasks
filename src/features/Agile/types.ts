export type IUser = {
  username: string;
  avatar?: string;
};

export type ISprint = {
  id: string;
  name: string;
  start: string;
  end: string;
  author: IUser;
  createdAt: string;
  updatedAt: string;
};

export type IBoard = {
  id: string;
  name: string;
  columns: string[];
  type: "scrum" | "canban";
  author: IUser;
  createdAt: string;
  updatedAt: string;
};

export type IStatusTransition = {
  from: string;
  to: string[];
};

export type IProject = {
  id: string;
  name: string;
  statusses: IStatusTransition[];
  tags: string[];
  boards: IBoard[];
  sprints: ISprint[];
  createdAt: string;
  updatedAt: string;
};

export type IIssueEvent = {
  author: IUser;
  event: string;
};

export type IIssueType = "epic" | "story" | "task" | "bug";
export type IBoardOrder = {
  boardId: string;
  position: number;
};

export type IIssue = {
  id: string;
  title: string;
  details: string;
  type: IIssueType;
  status: string;
  tags: string[];
  end: string;
  boardOrder: IBoardOrder[];
  author: IUser;
  assignee: IUser;
  history: IIssueEvent[];
  createdAt: string;
  updatedAt: string;
};
