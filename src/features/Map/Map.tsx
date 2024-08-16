import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";
import { useParams } from "../../lib/router";
import styles from "./Map.module.css";
import { PlaneList } from "./components/PlaneList";
import { PlaneMarkers } from "./components/PlaneMarkers";
import { IPlane, IPlanePosition, IPositionBoundaries } from "./types";
import { findCenterFromBoundaries } from "./utils";

export function Map() {
  const params = useParams();
  const [boundaries, center] = useMemo(() => {
    const { bl_lat, bl_lng, tr_lat, tr_lng } = params;
    const boundaries = { bl_lat, bl_lng, tr_lat, tr_lng };
    const center = findCenterFromBoundaries(boundaries);
    return [boundaries, center] as [IPositionBoundaries, [number, number]];
  }, [params]);

  const mapRef = useRef<L.Map>(null);
  const liRef = useRef<HTMLLIElement | null>();
  const markersRef = useRef<{
    findSelectedPlanePosition: () => IPlanePosition;
  }>();

  const [selectedCode, setSelectedCode] = useState<IPlane["code"]>();

  useEffect(() => {
    liRef.current?.scrollIntoView({ behavior: "smooth" });
    const position = markersRef.current?.findSelectedPlanePosition();
    if (!position) return;
    mapRef.current?.setView([position.lat, position.lng]);
  }, [selectedCode]);

  return (
    <>
      <h1>Map</h1>
      <header className={styles.header}></header>

      <br />
      <main className={styles.main}>
        <PlaneList selectedCode={selectedCode} onCodeSelected={setSelectedCode} ref={liRef} />

        <MapContainer
          center={center}
          zoom={6}
          ref={mapRef}
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
                <PlaneMarkers
                  boundaries={boundaries}
                  selectedCode={selectedCode}
                  onCodeSelected={setSelectedCode}
                  ref={markersRef}
                />
              </LayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </main>
    </>
  );
}
