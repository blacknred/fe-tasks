import { IPlanePosition, IPositionBoundaries } from "./types";

function getRandomInRange(from: number, to: number, fixed: number) {
  return +(Math.random() * (to - from) + from).toFixed(fixed);
}

export const PLANECODES = [
  "ATL143",
  "AUS625",
  "BNA904",
  "BLR250",
  "BEY156",
  "LAX034",
  "BHM413",
  "BNH983",
  "AZA172",
  "BEG215",
  "BLD012",
  "ARN873",
];

const DIRECTIONS = ["w", "e", "n", "s"];

export function findCenterFromBoundaries(boundaries: IPositionBoundaries) {
  const center: [number, number] = [0, 0];
  center[0] = (boundaries.bl_lat + boundaries.tr_lat) / 2;
  center[1] = (boundaries.bl_lng + boundaries.tr_lng) / 2;
  return center;
}

export function* planePositionGenerator(
  boundaries: IPositionBoundaries
): Generator<IPlanePosition[], void, unknown> {
  const planePositions: IPlanePosition[] = PLANECODES.map((code) => ({
    lat: getRandomInRange(boundaries.bl_lat, boundaries.tr_lat, 3), // -180, 180
    lng: getRandomInRange(boundaries.bl_lng, boundaries.tr_lng, 3), // -180, 180
    direction: DIRECTIONS[
      Math.floor(Math.random() * DIRECTIONS.length)
    ] as IPlanePosition["direction"],
    code,
  }));

  while (true) {
    const isDone = yield planePositions;

    if (isDone) return;

    for (let i = 0; i < planePositions.length; i++) {
      switch (planePositions[i].direction) {
        case "w":
          planePositions[i].lat -= 0.005;
          break;
        case "e":
          planePositions[i].lat += 0.005;
          break;
        case "n":
          planePositions[i].lng -= 0.005;
          break;
        case "s":
          planePositions[i].lng += 0.005;
          break;
        default:
      }
    }
  }
}
