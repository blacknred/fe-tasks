import useQuery from "../../../hooks/useQuery";
import { ID, ISprint } from "../types";
import { generateSprints } from "../utils";
import { HOST } from "./host";

export const useSprints = (projectId: ID) =>
  useQuery<ISprint[]>(HOST + `projects/${projectId}/sprints`, {
    fallback: generateSprints(2),
  });
