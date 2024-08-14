import useQuery from "../../../hooks/useQuery";
import { IBoard, ID } from "../types";
import { generateBoards } from "../utils";
import { HOST } from "./host";

export const useBoards = (projectId: ID) =>
  useQuery<IBoard[]>(HOST + `projects/${projectId}/boards`, {
    fallback: generateBoards(1),
  });
