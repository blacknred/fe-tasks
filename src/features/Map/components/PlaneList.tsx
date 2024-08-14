import { Dispatch, forwardRef, SetStateAction } from "react";
import { usePlanes } from "../api/getPlanes";
import { IPlane } from "../types";
import styles from "./Map.module.css";

export type PlaneListProps = {
  selectedCode?: IPlane["code"];
  onCodeSelected: Dispatch<SetStateAction<IPlane["code"] | undefined>>;
};

export const PlaneList = forwardRef<unknown, PlaneListProps>(({ selectedCode, onCodeSelected }, ref) => {
  const [planes, _, isFetching] = usePlanes();

  return (

    <div>
      {isFetching ? (
        <p>Fetching...</p>
      ) : (
        <ul>
          {planes?.map((plane) => (
            <li
              key={plane.code}
              className={selectedCode === plane.code ? styles.active : ""}
              // @ts-ignore
              ref={selectedCode === plane.code ? ref : null}
            >
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onCodeSelected(plane.code);
                }}
              >
                {plane.code}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
})
