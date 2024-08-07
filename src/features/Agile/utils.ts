
export const STATUSSES = [
  "todo",
  "in_progress",
  "done",
  "qa",
  "review",
  "design",
];

/**
 * 
 * @param n 
 * @param t 
 * @returns 
 */
export function getTasks(n = 10, t = 3) {
  return Array(n)
    .fill(0)
    .map((_, idx) => {
      const rand = Math.random();
      return {
        id: idx,
        status: STATUSSES[Math.floor(rand * STATUSSES.length)],
        title: rand.toString(36).substr(2),
        boardOrder: Math.random() > 0.5 ? Math.floor(rand * 10) : null,
      };
    });
}

export function prepareTasksForBoard(tasks) {
  const grouped = Object.groupBy(tasks, (t) => t.status);
  for (let status of STATUSSES) {
    if (!grouped[status]) grouped[status] = [];
    else grouped[status].sort((a, b) => a.boardOrder - b.boardOrder);
  }
  return grouped;
}

