import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
} from "react";
import { Marker, Tooltip } from "react-leaflet";
import { usePlanePositions } from "../api";
import { IPlane, IPositionBoundaries } from "../types";
import icon from "../assets/plane.png";

const planeIcon = L.icon({
  iconUrl: icon,
  iconSize: [20, 20],
  className: "",
});

export type MarkersProps = {
  boundaries: IPositionBoundaries;
  selectedCode?: IPlane["code"];
  setSelectedCode: Dispatch<SetStateAction<IPlane["code"] | undefined>>;
};

export const Markers = forwardRef(
  ({ boundaries, selectedCode, setSelectedCode }: MarkersProps, ref) => {
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
              click: () => setSelectedCode(code),
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
