import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayersControl,
  MapContainer,
  TileLayer,
  LayerGroup,
} from "react-leaflet";
import { usePlanes } from "./api";
import styles from "./Map.module.css";
import { Markers } from "./Markers";
import { IPlane, IPlanePosition, IPositionBoundaries } from "./types";
import { findCenterFromBoundaries } from "./utils";

export type MapProps = {
  boundaries: IPositionBoundaries;
};

export function Map({ boundaries }: MapProps) {
  const [planes, _, isFetching] = usePlanes();
  const [selectedCode, setSelectedCode] = useState<IPlane["code"]>();

  const center = useMemo(
    () => findCenterFromBoundaries(boundaries),
    [boundaries]
  );

  const liRef = useRef<HTMLLIElement>();
  const map = useRef<L.Map>(null);
  const layersRef = useRef<{
    findSelectedPlanePosition: () => IPlanePosition;
  }>();

  useEffect(() => {
    liRef.current?.scrollIntoView({ behavior: "smooth" });
    const position = layersRef.current?.findSelectedPlanePosition();
    if (!position) return;
    map.current?.setView([position.lat, position.lng]);
  }, [selectedCode]);

  return (
    <>
      <h1>Map</h1>
      <header className={styles.header}></header>

      <br />
      <main className={styles.main}>
        <div>
          {isFetching ? (
            <p>Fetching...</p>
          ) : (
            <ul>
              {planes?.map((plane) => (
                <li
                  key={plane.code}
                  className={selectedCode === plane.code ? styles.active : ""}
                  ref={selectedCode === plane.code ? liRef : undefined}
                >
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCode(plane.code);
                    }}
                  >
                    {plane.code}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <MapContainer
          center={center}
          zoom={6}
          ref={map}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Show planes">
              <LayerGroup>
                <Markers
                  boundaries={boundaries}
                  selectedCode={selectedCode}
                  setSelectedCode={setSelectedCode}
                  ref={layersRef}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </main>
    </>
  );
}

// function SetViewOnClick({ animateRef }) {
//   const map = useMapEvent("click", (e) => {
//     map.setView(e.latlng, map.getZoom(), {
//       animate: animateRef.current || false,
//     });
//   });

//   return null;
// }

// const animateRef = useRef(true);
// const map = useMapEvent("click", (e) => {
//   map.setView(e.latlng, map.getZoom(), {
//     animate: animateRef.current || false,
//   });
// });
