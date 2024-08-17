import useQuery from "../../../hooks/useQuery";
import { IBoard, ID } from "../types";
import { generateBoard } from "../utils";
import { HOST } from "./host";

export const board = generateBoard();

export const useBoard = (projectId: ID) =>
  useQuery<IBoard>(HOST + `projects/${projectId}/board`, {
    fallback: board,
  });
