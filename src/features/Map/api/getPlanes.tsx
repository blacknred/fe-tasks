import useQuery from "../../../hooks/useQuery";
import { IPlane } from "../types";
import { DB } from "./db";

const HOST = "https://map/planes";

export const usePlanes = () =>
  useQuery<IPlane[]>(HOST, { fallback: DB.planes });
