// import Observable, { useObservable } from "../../../../lib/observable";
// import { board } from "../../api/getBoards";
// import { issues } from "../../api/getIssues";
// import { sprints } from "../../api/getSprints";
// import { statusses } from "../../api/getStatusses";
// import { users } from "../../api/getUsers";
// import {
//   IBoard,
//   IIssue,
//   IIssueFilters,
//   IIssueStatus,
//   IssueType,
//   IProfile,
// } from "../../types";
// import {
//   filterIssues,
//   findActiveSprint,
//   prepareIssuesForBoard,
// } from "../../utils";

// type State = {
//   board?: IBoard;
//   statusses?: IIssueStatus[];
//   issues?: Record<string, IIssue[]>;
//   issuesSnapshot?: Record<string, IIssue[]>;
//   users?: IProfile[];
//   epics?: string[];
//   isEditable: boolean;
// };
// const initialState: State = { isEditable: false };

// class BoardStore extends Observable<State> {
//   constructor() {
//     super(initialState);

//     this.populateState();
//   }

//   populateState() {
//     setTimeout(() => {
//       const sprintId = findActiveSprint(sprints);
//       const sprintIssues = filterIssues(issues, { sprintId });
//       const issuesSnapshot = prepareIssuesForBoard(sprintIssues, board.columns);

//       const epics = Object.values(issuesSnapshot)
//         .flat()
//         .reduce((p, n) => {
//           if (n.type === IssueType.EPIC) p.add(n.id);
//           return p;
//         }, new Set<string>());

//       this.state = {
//         ...this.state,
//         board,
//         statusses,
//         users,
//         epics: Array.from(epics),
//         issuesSnapshot,
//         issues: { ...issuesSnapshot },
//       };
//     }, 1000);
//   }

//   addIssue() {}
//   filterIssues = (filters: IIssueFilters) => {
//     const { issues, issuesSnapshot } = this.state;
//     if (!issues || !issuesSnapshot) return;
//     for (let column in issues) {
//       issues[column] = filterIssues(issuesSnapshot[column], filters);
//     }
//     this.state = { ...this.state, issues };
//   };
//   shiftIssue = (nextColumn: string) => {
//     return (id: string, nextIdx: string) => {
//       const { issues } = this.state;

//       for (let column in issues) {
//         const idx = issues[column].findIndex((t) => t.id == id);
//         if (idx === -1) continue;

//         const [issue] = issues[column].splice(idx, 1);
//         issue.status = nextColumn;
//         issues[nextColumn.toLowerCase()].splice(+nextIdx, 0, issue);

//         this.state = { ...this.state, issues };

//         // TODO: update on be
//       }
//     };
//   };

//   //
//   switchEditable = () => {
//     const { isEditable } = this.state;
//     this.state = { ...this.state, isEditable: !isEditable };

//     // TODO: update board on be
//   };
//   addColumn = (status: string) => {
//     const { board } = this.state;
//     board?.columns.push({ name: status, status, issueOrder: {} });
//     this.state = { ...this.state, board };
//   };
//   removeColumn = (name: string) => {
//     return () => {
//       const { board } = this.state;
//       if (!board) return;
//       board.columns = board.columns?.filter((c) => c.name !== name);
//       this.state = { ...this.state, board };
//     };
//   };
//   shiftColumn = (prevIdx: string, nextIdx: string) => {
//     const { board } = this.state;
//     if (!board) return;
//     const [column] = board.columns.splice(+prevIdx, 1);
//     board.columns.splice(+nextIdx, 0, column);
//     this.state = { ...this.state, board };
//   };
// }

// export const store = new BoardStore();

// export const useBoard = () => useObservable(store);
