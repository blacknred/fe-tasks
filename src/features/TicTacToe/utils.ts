import { IBoard } from "./types";

export const STRATEGIES: Record<number, number[][]> = {
  9: [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [3, 4, 5],
    [2, 5, 8],
    [2, 4, 6],
    [6, 7, 8],
  ],
};

export function findWonStrategy(board: IBoard, capacity: number) {
  return STRATEGIES[capacity]?.find((strategy) =>
    ["X", "0"].some((value) => strategy.every((idx) => board[idx] === value))
  );
}

export function getRandomEmptyIndex(board: IBoard) {
  const emptyCells = board.reduce(
    (all, v, i) => (!v ? [...all, i] : all),
    [] as number[]
  );

  const idx = Math.floor(Math.random() * emptyCells.length);

  return emptyCells[idx];
}
