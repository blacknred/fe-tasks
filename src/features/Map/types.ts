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
  bl_lat: string;
  bl_lng: string;
  tr_lat: string;
  tr_lng: string;
};
