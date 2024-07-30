export type IPlane = {
  code: string;
};

export type IPlanePosition = {
  lng: number;
  lat: number;
  code: IPlane["code"];
  direction?: "w" | "e" | "n" | "s";
};

export type IPositionBoundaries = {
  bl_lat: number;
  bl_lng: number;
  tr_lat: number;
  tr_lng: number;
};
