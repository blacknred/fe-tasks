import {
  IBoard,
  IBoardColumn,
  IIssue,
  IIssueFilters,
  ISprint,
  IssuePriority,
  IssueType,
  IUserPreview,
} from "./types";

export const STATUSSES = [
  "todo",
  "in_progress",
  "done",
  "qa",
  "review",
  "design",
];

export const DAY = 1000 * 60 * 60 * 24;

const EPIC_DURATION = 30;

export function generateBoard(): IBoard {
  const statussesCount = Math.floor(Math.random() * STATUSSES.length);
  return {
    projectId: "1",
    columns: STATUSSES.slice(0, statussesCount).map((status) => ({
      status,
      name: status.toUpperCase(),
      issueOrder: {},
    })),
  };
}

export function generateUsers(length: number): IUserPreview[] {
  return Array.from({ length }).map((_, i) => ({
    image: `https://robohash.org/${i}.png/`,
    fullname: `user ${i}`,
    id: `${i}`,
  }));
}

export function generateSprints(length: number): ISprint[] {
  const now = Date.now();

  return Array.from({ length }).map((_, i) => ({
    id: `${i}`,
    projectId: "1",
    name: `Sprint #${i}`,
    startAt: new Date(now + i * DAY).toISOString(),
    endAt: new Date(now + (i + 6) * DAY).toISOString(),
  }));
}

export const generateIssues = (length: number): IIssue[] => {
  const now = Date.now();
  const priorities = Object.values(IssuePriority);
  const users = generateUsers(10);

  return Array.from({ length: Math.max(10, length) }, (_, i) => {
    const random = Math.random();
    const type =
      i % 10 === 0
        ? IssueType.EPIC
        : i % 3 === 0
        ? IssueType.STORY
        : IssueType.TASK;

    const issue: IIssue = {
      id: `${type}_${i}`,
      projectId: "1",
      type,
      name: `PRJ-${type === IssueType.EPIC ? i : `${i}${i}`}`,
      title: random.toString(36).substr(2),
      tags: [],
      assignee: users[Math.floor(random * users.length)],
      version: 1,
      status: {
        name:
          type === IssueType.EPIC
            ? STATUSSES[0]
            : STATUSSES[Math.floor(random * STATUSSES.length)],
        transitions: STATUSSES,
      },
    };

    if (issue.type === IssueType.EPIC) {
      issue.startAt = new Date(now + i * EPIC_DURATION * DAY).toISOString();
      issue.endAt = new Date(
        now + (i * EPIC_DURATION + EPIC_DURATION) * DAY
      ).toISOString();
      issue.progress = 0;

      return issue;
    }

    //         boardOrder: Math.random() > 0.5 ? Math.floor(rand * 10) : null,

    issue.priority = priorities[Math.floor(random * priorities.length)];

    if (random > 0.7) issue.sprintId = "1";

    if (issue.type === IssueType.STORY) {
      issue.epicId = Math.floor(random * 5).toString();
      issue.points = 1;
    }

    return issue;
  });
};

export function filterIssues(issues: IIssue[], filters: IIssueFilters) {
  const { tag, type, assigneeId, priority, epicId, sprintId } = filters;
  return issues.filter((issue) => {
    if (type && issue.type !== type) return false;
    if (priority && "priority" in issue && issue.priority !== priority) {
      return false;
    }
    if (tag && !issue.tags?.includes(tag)) return false;
    if (assigneeId && issue.assignee?.id !== assigneeId) return false;
    if (epicId && "epicId" in issue && issue.epicId !== epicId) {
      return false;
    }
    if (sprintId && "sprintId" in issue && issue.sprintId !== sprintId) {
      return false;
    }
    if (sprintId === null && "sprintId" in issue && issue.sprintId) {
      return false;
    }
    return true;
  });
}

export function prepareIssuesForBoard(
  issues: IIssue[],
  columns: IBoardColumn[]
) {
  const grouped: Record<string, IIssue[]> = {};
  for (let status of STATUSSES) {
    grouped[status] = issues.filter((i) => (i.status.name = status));
  }
  for (let column of columns) {
    const { status, issueOrder } = column;
    grouped[status]?.sort((a, b) => issueOrder[a.id] - issueOrder[b.id]);
  }
  return grouped;
}

export function findCurrentSprint(sprints: ISprint[]) {
  const today = new Date();
  const currentSprint = sprints.find(
    (s) => new Date(s.startAt) < today && today < new Date(s.endAt)
  );
  return currentSprint?.id || "1";
}
