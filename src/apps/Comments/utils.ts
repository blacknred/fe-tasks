import { IComment } from "./types";
import { groupBy } from "../../utils/groupBy";

export function transformComments(rawData: IComment[], viewMode: number) {
  if (viewMode === 1) {
    const grouping = groupBy(rawData, (c) => c.postId);
    return Object.keys(grouping).map((k, i) => ({
      children: Math.random() > 0.5 ? grouping[k] : undefined,
      ...rawData[i],
    }));
  }

  return rawData.map((item) => ({
    parent: Math.random() > 0.5 ? rawData[item.postId] : undefined,
    ...item,
  }));
}
