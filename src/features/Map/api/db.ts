import { IPlanePosition, IPositionBoundaries } from "../types";

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

const PLANE_REPOSITION_INTERVAL = 1000;

function getRandomInRange(from: number, to: number, fixed: number) {
  return +(Math.random() * (to - from) + from).toFixed(fixed);
}

function* planePositionGenerator(
  boundaries: IPositionBoundaries
): Generator<IPlanePosition[], void, unknown> {
  const planePositions: IPlanePosition[] = PLANECODES.map((code) => ({
    lat: getRandomInRange(+boundaries.bl_lat, +boundaries.tr_lat, 3), // -180, 180
    lng: getRandomInRange(+boundaries.bl_lng, +boundaries.tr_lng, 3), // -180, 180
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

export const DB = (() => ({
  planes: PLANECODES.map((code) => ({ code })),
  subscribe(client: any, boundaries: IPositionBoundaries) {
    const generator = planePositionGenerator(boundaries);
    const interval = setInterval(() => {
      client.sendMessage(generator.next().value);
    }, PLANE_REPOSITION_INTERVAL);

    return () => clearInterval(interval);
  },
}))();
