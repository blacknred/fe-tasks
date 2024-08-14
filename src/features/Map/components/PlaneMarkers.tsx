import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
} from "react";
import { Marker, Tooltip } from "react-leaflet";
import { usePlanePositions } from "../api/getPlanePositions";
import icon from "../assets/plane.png";
import { IPlane, IPositionBoundaries } from "../types";

const planeIcon = L.icon({
  iconUrl: icon,
  iconSize: [20, 20],
  className: "",
});

export type PlaneMarkersProps = {
  boundaries: IPositionBoundaries;
  selectedCode?: IPlane["code"];
  onCodeSelected: Dispatch<SetStateAction<IPlane["code"] | undefined>>;
};

export const PlaneMarkers = forwardRef<unknown, PlaneMarkersProps>(
  ({ boundaries, selectedCode, onCodeSelected }, ref) => {
    const { lastMessage } = usePlanePositions(boundaries);

    useImperativeHandle(ref, () => ({
      findSelectedPlanePosition: () =>
        lastMessage?.find((p) => p.code === selectedCode),
    }));

    return (
      <>
        {lastMessage?.map(({ code, ...position }) => (
          <Marker
            key={code}
            position={position}
            icon={planeIcon}
            eventHandlers={{
              click: () => onCodeSelected(code),
            }}
          >
            {selectedCode === code && (
              <Tooltip direction="top" offset={[0, -10]} permanent>
                <p>
                  Code: {code}
                  <div>Lat: {position.lat.toFixed(3)}</div>
                  <div>Lng: {position.lng.toFixed(3)}</div>
                </p>
              </Tooltip>
            )}
          </Marker>
        ))}
      </>
    );
  }
);
