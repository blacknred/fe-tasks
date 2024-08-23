import useQuery from "../../../hooks/useQuery";
import { ID, IProfile } from "../types";
import { DB } from "./db";
import { HOST } from "./host";

export const useUsers = (projectId: ID) =>
  useQuery<IProfile[]>(HOST + `projects/${projectId}/users`, {
    fallback: DB.users,
  });
