import {
  IBoard,
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

export function generateUserPreviews(length: number): IUserPreview[] {
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

export function generateBoards(length: number): IBoard[] {
  return Array.from({ length }).map((_, i) => ({
    id: `${i}`,
    projectId: "1",
    name: `Board${i}`,
    columns: STATUSSES.slice(-1, i).map((status) => ({
      status,
      name: status.toUpperCase(),
      issueOrder: {},
    })),
  }));
}

export const generateIssues = (length: number, isEpic = false): IIssue[] => {
  const now = Date.now();
  const priorities = Object.values(IssuePriority);
  const users = generateUserPreviews(10);

  return Array.from({ length }, (_, i) => {
    const random = Math.random();
    const type = isEpic
      ? IssueType.EPIC
      : random > 0.5
      ? IssueType.STORY
      : IssueType.TASK;

    const issue: IIssue = {
      id: `${type}_${i}`,
      projectId: "1",
      type,
      name: `PRJ-${isEpic ? i : `${i}${i}`}`,
      title: random.toString(36).substr(2),
      tags: [],
      assignee: users[Math.floor(random * users.length)],
      version: 1,
    };

    if (isEpic) {
      issue.startAt = new Date(now + i * EPIC_DURATION * DAY).toISOString();
      issue.endAt = new Date(
        now + (i * EPIC_DURATION + EPIC_DURATION) * DAY
      ).toISOString();
      issue.progress = 0;

      return issue;
    }

    issue.status = {
      name: STATUSSES[Math.floor(random * STATUSSES.length)],
      transitions: STATUSSES,
    };

    issue.priority = priorities[Math.floor(random * priorities.length)];

    if (random > 0.7) issue.sprintId = "1";

    if (type === IssueType.STORY) {
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
    if (priority && issue.priority !== priority) return false;
    if (tag && !issue.tags?.includes(tag)) return false;
    if (assigneeId && issue.assignee?.id !== assigneeId) return false;
    if (epicId && issue.epicId !== epicId) return false;
    if (sprintId && issue.sprintId !== sprintId) return false;
    if (sprintId === null && issue.sprintId) return false;
    return true;
  });
}

// /**
//  *
//  * @param n
//  * @param t
//  * @returns
//  */
// export function getTasks(n = 10, t = 3) {
//   return Array(n)
//     .fill(0)
//     .map((_, idx) => {
//       const rand = Math.random();
//       return {
//         id: idx,
//         status: STATUSSES[Math.floor(rand * STATUSSES.length)],
//         title: rand.toString(36).substr(2),
//         boardOrder: Math.random() > 0.5 ? Math.floor(rand * 10) : null,
//       };
//     });
// }

// export function prepareTasksForBoard(tasks) {
//   const grouped = Object.groupBy(tasks, (t) => t.status);
//   for (let status of STATUSSES) {
//     if (!grouped[status]) grouped[status] = [];
//     else grouped[status].sort((a, b) => a.boardOrder - b.boardOrder);
//   }
//   return grouped;
// }
