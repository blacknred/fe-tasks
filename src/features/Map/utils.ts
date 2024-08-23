import { IPositionBoundaries } from "./types";

export function findCenterFromBoundaries(boundaries: IPositionBoundaries) {
  const center: [number, number] = [0, 0];
  center[0] = (+boundaries.bl_lat + +boundaries.tr_lat) / 2;
  center[1] = (+boundaries.bl_lng + +boundaries.tr_lng) / 2;
  return center;
}
