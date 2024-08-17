import {
  IBoard,
  IBoardColumn,
  IIssue,
  IIssueFilters,
  IIssueStatus,
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

function generateRandomText(
  paragraphCount: number,
  sentencesPerParagraphCount: number
) {
  const words = [
    "lorem",
    "ipsum",
    "dolor",
    "sit",
    "amet",
    "consectetur",
    "adipiscing",
    "elit",
    "sed",
    "do",
    "eiusmod",
    "tempor",
    "incididunt",
    "ut",
    "labore",
    "et",
    "dolore",
    "magna",
    "aliqua",
  ];
  const paragraphs = [];

  for (let p = 0; p < paragraphCount; p++) {
    const sentences = [];

    for (let i = 0; i < sentencesPerParagraphCount; i++) {
      const numWords = Math.floor(Math.random() * 10) + 5;
      const sentenceWords = [];

      for (let j = 0; j < numWords; j++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        sentenceWords.push(words[randomIndex]);
      }

      const sentence = sentenceWords.join(" ") + ".";
      sentences.push(sentence.charAt(0).toUpperCase() + sentence.slice(1));
    }

    paragraphs.push(sentences.join(" "));
  }

  return paragraphs.join("\n\n");
}

export function generateStatusses(): IIssueStatus[] {
  return STATUSSES.map((name) => ({
    name,
    transitions: STATUSSES,
  }));
}

export function generateBoard(): IBoard {
  return {
    projectId: "1",
    columns: STATUSSES.slice(0, 3).map((status) => ({
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
    id: `${i + 1}`,
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
      id: `${type}_${i + 1}`,
      projectId: "1",
      type,
      name: `PRJ-${type === IssueType.EPIC ? i : `${i}${i}`}`,
      title: generateRandomText(1, 1),
      tags: [],
      assignee: users[Math.floor(random * users.length)],
      version: 1,
      status:
        type === IssueType.EPIC
          ? STATUSSES[0]
          : STATUSSES[Math.floor(Math.random() * 3)],
    };

    if (issue.type === IssueType.EPIC) {
      issue.startAt = new Date(now + i * EPIC_DURATION * DAY).toISOString();
      issue.endAt = new Date(
        now + (i * EPIC_DURATION + EPIC_DURATION) * DAY
      ).toISOString();
      issue.progress = 0;

      return issue;
    }

    issue.priority = priorities[Math.floor(Math.random() * priorities.length)];
    issue.sprintId = type === IssueType.EPIC || random < 0.7 ? undefined : "1";

    if (issue.type === IssueType.STORY) {
      issue.epicId = Math.floor(random * 5).toString();
      issue.points = 1;
    }

    return issue;
  });
};

export function filterIssues(issues: IIssue[], filters: IIssueFilters) {
  const { tag, type, assigneeId, priority, epicId, sprintId, search } = filters;
  console.log(type);
  return issues.filter((issue) => {
    if (search && !issue.title.includes(search)) return false;
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

export function prepareIssuesForBoard(
  issues: IIssue[],
  columns: IBoardColumn[]
) {
  const grouped: Record<string, IIssue[]> = {};
  for (let status of STATUSSES) {
    grouped[status] = issues.filter((i) => i.status === status);
    const column = columns.find((c) => c.status === status);
    if (!column) continue;
    grouped[status]?.sort(
      (a, b) => column.issueOrder[a.id] - column.issueOrder[b.id]
    );
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
