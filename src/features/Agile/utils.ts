import { IBoardColumn, ID, IIssue, IIssueFilters, IIssueStatus } from "./types";

export const DAY = 1000 * 60 * 60 * 24;

export function getRand(max: number) {
  return Math.floor(Math.random() * max);
}

export function getRandomWord() {
  return Math.random().toString(36).substring(2);
}

export function getRandomText(
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

export function prepareIssuesForBoard(
  issues: IIssue[],
  columns: IBoardColumn[]
) {
  const grouped = Object.groupBy(issues, (i) => i.status) as Record<string, IIssue[]>;

  for (let status of Object.keys(grouped)) {
    const column = columns.find((c) => c.status === status);
    if (!column) continue;
    grouped[status]?.sort(
      (a, b) => column.issueOrder[a.id] - column.issueOrder[b.id]
    );
  }

  return grouped;
}

export function filterIssues(issues: IIssue[], filters: IIssueFilters) {
  const {
    tag,
    type,
    assigneeId,
    priority,
    epicId,
    sprintId,
    search,
    startAt,
    endAt,
  } = filters;

  return issues.filter((issue) => {
    if (search && !issue.title.includes(search)) return false;
    if (type && issue.type !== type) return false;
    if (priority && issue.priority !== priority) return false;
    if (tag && !issue.tags?.includes(tag)) return false;
    if (assigneeId && issue.assignee?.id !== assigneeId) return false;
    if (epicId && issue.epicId !== epicId) return false;
    if (sprintId && issue.sprintId !== sprintId) return false;
    if (sprintId === null && issue.sprintId) return false;
    if (startAt && issue.startAt && issue.startAt < startAt) return false;
    if (endAt && issue.endAt && issue.endAt > endAt) return false;
    return true;
  });
}

export function getEpicsFromIssues(issues: IIssue[]) {
  return issues.reduce((p, n) => {
    if (n.epicId && !p.includes(n.epicId)) p.push(n.epicId);
    return p;
  }, [] as ID[]);
}
