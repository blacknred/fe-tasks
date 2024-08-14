import useQuery from "../../../hooks/useQuery";
import { IPlane } from "../types";
import { PLANECODES } from "../utils";

const HOST = "https://map/planes";

export const usePlanes = () =>
  useQuery<IPlane[]>(HOST, { fallback: PLANECODES.map((code) => ({ code })) });
