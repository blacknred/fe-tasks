import {
  IBoard,
  ID,
  IIssue,
  IIssueFilters,
  IIssueStatus,
  IProfile,
  ISprint,
  IssuePriority,
  IssueType,
} from "../types";
import {
  DAY,
  filterIssues,
  getRand,
  getRandomText,
  getRandomWord,
} from "../utils";

const EPIC_DURATION = 30;

const BOARD_EVENT_INTERVAL = 10000;

export const STATUSSES = [
  "todo",
  "in_progress",
  "done",
  "qa",
  "review",
  "design",
];

function generateStatusses(): IIssueStatus[] {
  return STATUSSES.map((name) => ({
    transitions: STATUSSES,
    name,
  }));
}

function generateBoards(length: number): IBoard[] {
  return Array.from({ length }).map((_, i) => ({
    projectId: "1",
    name: `Board #${i + 1}`,
    id: `${i + 1}`,
    type: "scrum",
    columns: STATUSSES.slice(0, getRand(STATUSSES.length - 1)).map(
      (status) => ({
        name: status.toUpperCase(),
        issueOrder: {},
        status,
      })
    ),
  }));
}

function generateUsers(length: number): IProfile[] {
  return Array.from({ length }).map((_, i) => ({
    image: `https://robohash.org/${i}.png/`,
    fullname: `user ${i}`,
    id: `${i}`,
  }));
}

function generateSprints(length: number): ISprint[] {
  const now = Date.now();
  return Array.from({ length }).map((_, i) => ({
    id: `${i + 1}`,
    projectId: "1",
    name: `Sprint #${i + 1}`,
    startAt: new Date(now + i * DAY).valueOf(),
    endAt: new Date(now + (i + 6) * DAY).valueOf(),
  }));
}

const generateIssues = (length: number): IIssue[] => {
  const now = Date.now();
  const priorities = Object.values(IssuePriority);
  const users = generateUsers(10);
  const epicIds: string[] = [];

  return Array.from({ length }, (_, i) => {
    const type =
      i % 10 === 0
        ? IssueType.EPIC
        : i % 3 === 0
        ? IssueType.STORY
        : IssueType.TASK;

    const issue: IIssue = {
      id: `PRJ-${type === IssueType.EPIC ? i : `${i}${i}`}`,
      projectId: "1",
      type,
      title: getRandomText(1, 1),
      tags: Array.from({ length: getRand(4) }, getRandomWord),
      assignee: users[getRand(users.length)],
      version: 1,
      status: type === IssueType.EPIC ? STATUSSES[0] : STATUSSES[getRand(4)],
    };

    if (issue.type === IssueType.EPIC) {
      epicIds.push(issue.id);
      issue.sprintId = undefined;

      issue.startAt = new Date(now + i * EPIC_DURATION * DAY).valueOf();
      issue.endAt = new Date(
        now + (i * EPIC_DURATION + EPIC_DURATION) * DAY
      ).valueOf();
      issue.progress = 0;

      return issue;
    }
    issue.priority = priorities[getRand(priorities.length + 1)];
    issue.sprintId = ["1", "2", undefined][getRand(3)];

    if (
      issue.priority === IssuePriority.BLOCKER ||
      issue.priority === IssuePriority.CRITICAL
    ) {
      if (issue.type === IssueType.STORY) {
        issue.startAt = new Date(now + i * DAY).valueOf();
      }
      issue.endAt = new Date(now + (i + 2) * DAY).valueOf();
    }

    if (issue.type === IssueType.STORY) {
      issue.epicId = epicIds[getRand(epicIds.length)];
      issue.points = 1;
    }

    return issue;
  });
};

export const DB = (({
  usersLength = 10,
  boardsLength = 10,
  sprintsLength = 10,
  issuesLength = 10,
}) => ({
  users: generateUsers(usersLength),
  boards: generateBoards(boardsLength),
  sprints: generateSprints(sprintsLength),
  issues: generateIssues(issuesLength),
  statusses: generateStatusses(),
  findActiveSprint: function () {
    const today = Date.now();
    return this.sprints.find((s) => s.startAt < today && today < s.endAt);
  },
  findIssues(filters: IIssueFilters) {
    return filterIssues(this.issues, filters);
  },
  subscribe(client: any, boardId: ID) {
    const generator = boardUpdateGenerator(this, boardId);
    const interval = setInterval(() => {
      client.sendMessage(generator.next().value);
    }, BOARD_EVENT_INTERVAL);

    return () => clearInterval(interval);
  },
}))({
  usersLength: 10,
  boardsLength: 2,
  sprintsLength: 2,
  issuesLength: 200,
});

function* boardUpdateGenerator(
  db: typeof DB,
  boardId: ID
): Generator<IIssue, void, unknown> {
  const priorities = Object.values(IssuePriority);
  const board = db.boards.find((b) => b.id === boardId)!;
  const issues = filterIssues(db.issues, {
    sprintId: db.findActiveSprint()?.id,
  });

  while (true) {
    const issue = issues[getRand(issues.length)];

    switch (getRand(3)) {
      case 1:
        issue.status = board.columns[getRand(board.columns.length)]?.status;
        issue.assignee = db.users[getRand(db.users.length)];
        break;
      case 2:
        issue.priority = priorities[getRand(priorities.length)];
        break;
      case 3:
        issue.tags = [getRandomWord(), getRandomWord()];
        break;
      default:
    }

    const isDone = yield issue;
    if (isDone) return;
  }
}
