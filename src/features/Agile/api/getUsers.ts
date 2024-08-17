import useQuery from "../../../hooks/useQuery";
import { ID, IUserPreview } from "../types";
import { generateUsers } from "../utils";
import { HOST } from "./host";

export const users = generateUsers(10);

export const useUsers = (projectId: ID) =>
  useQuery<IUserPreview[]>(HOST + `projects/${projectId}/users`, {
    fallback: users,
    log: true,
  });
