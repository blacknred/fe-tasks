import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { useParams } from "../../lib/router";
import styles from "./Map.module.css";
import { usePlanes } from "./api";
import { Markers } from "./components/Markers";
import { IPlane, IPlanePosition, IPositionBoundaries } from "./types";
import { findCenterFromBoundaries } from "./utils";

export function Map() {
  const [planes, _, isFetching] = usePlanes();
  const [selectedCode, setSelectedCode] = useState<IPlane["code"]>();

  const params = useParams();
  const boundaries: IPositionBoundaries = useMemo(() => {
    const { bl_lat, bl_lng, tr_lat, tr_lng } = params;
    return { bl_lat, bl_lng, tr_lat, tr_lng };
  }, [params]);

  const center = useMemo(
    () => findCenterFromBoundaries(boundaries),
    [boundaries]
  );

  const liRef = useRef<HTMLLIElement | null>();
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
                  ref={(el) => {
                    if (selectedCode === plane.code) liRef.current = el;
                  }}
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
