import { useRef, useState, useCallback, memo, Fragment } from "react";
import { useMouseMove } from "../../../../hooks/useMouseMove";
import styles from "./Gantt.module.css";

const epics = [
  {
    name: "First epic",
    start: 10,
    end: 360,
    stories: [
      { name: "A new Story", start: 70, end: 290, progress: 10 },
      {
        name: "An old Story without context",
        start: 30,
        end: 160,
        progress: 63,
      },
    ],
  },
];

const items = Array(8).fill(0);
const colls = Array(365).fill(0);

export function Gantt() {
  return (
    <div className={styles.grid}>
      <ul>
        <li>Epics</li>
        {items.map((item, idx) => (
          <li key={idx}>{idx + 1}</li>
        ))}
      </ul>

      <div
        style={{
          gridTemplate: `repeat(${items.length + 1}, 3em) / repeat(${
            colls.length
          }, 4em)`,
        }}
      >
        {/* header */}
        {colls.map((_, idx) => (
          <div key={idx} style={{ backgroundColor: "#f5f5f5" }}>
            {idx + 1}d
          </div>
        ))}
        {/* content */}
        {items.map((_, idx) => {
          const backgroundColor = idx % 2 ? "#f5f5f5" : "default";
          return colls.map((_, i) => (
            <div key={i} style={{ backgroundColor }}></div>
          ));
        })}
      </div>
    </div>
  );
  //   return (
  //     <ul className={styles.list}>
  //       {epics.map((epic) => (
  //         <EpicBar key={epic.name} {...epic} />
  //       ))}
  //     </ul>
  //   );
}

// function EpicBar(epic) {
//   const [minDate, setMinDate] = useState(epic.start);
//   const [maxDate, setMaxDate] = useState(epic.end);
//   const [progress, setProgress] = useState(
//     () => epic.stories.reduce((p, c) => p + c.progress, 0) / epic.stories.length
//   );

//   const handleProgressUpdate = useCallback(
//     (delta) => {
//       const len = epic.stories.length;
//       setProgress((prev) => (prev * len + delta) / len);
//     },
//     [epic.stories]
//   );

//   return (
//     <>
//       <li></li>
//       <li>
//         <div>{epic.name}</div>
//         <div>
//           <StoryBar
//             {...epic}
//             disableProgressUpdate
//             progress={progress}
//             onEndDateUpdate={setMaxDate}
//             onStartDateUpdate={setMinDate}
//           />
//         </div>
//       </li>
//       {epic.stories.map((story) => (
//         <li key={story.name}>
//           <div>{story.name}</div>
//           <StoryBar
//             {...story}
//             minDate={minDate}
//             maxDate={maxDate}
//             onProgressUpdate={handleProgressUpdate}
//           />
//         </li>
//       ))}
//     </>
//   );
// }

// function StoryBar({
//   name,
//   start,
//   end,
//   minDate,
//   maxDate,
//   onStartDateUpdate,
//   onEndDateUpdate,
//   progress,
//   onProgressUpdate,
//   disableProgressUpdate,
// }) {
//   const [left, setLeft] = useState(start);
//   const [right, setRight] = useState(end);

//   const el = useMouseMove((ev) => {
//     // x.current = ev.clientX - r.current.clientWidth / 2;
//     // const delta = ev.clientX - prevClientX.current;
//     // prevClientX.current = ev.clientX;
//     // const prevLeft = el.current.style.left.slice(0, -2);
//     // el.current.style.left = +prevLeft + delta + "px";
//     const w = ev.clientX - el.current.clientWidth / 2;
//     if (w < minDate || w > maxDate) return;
//     el.current.style.left = w + "px";
//     // console.log(delta, el.current.style.left);
//     // setX((prev) => prev + 1);
//     // setX(ev.clientX - ev.target.offsetLeft);
//     // setX(ev.clientX - r.current.clientWidth / 2);
//     // my pos - ev.clientX ev.clientX - ev.offsetX
//   });

//   const handleStartDateChange = useCallback(
//     (val) => {
//       if (val < minDate || val > maxDate) return;
//       if (val + 20 >= right) return;
//       setLeft(val);
//       onStartDateUpdate?.(val);
//       console.log("start", val);
//     },
//     [onStartDateUpdate, minDate, maxDate, right]
//   );

//   const handleEndDateChange = useCallback(
//     (val) => {
//       if (val < minDate || val > maxDate) return;
//       if (val - 20 <= left) return;
//       setRight(val);
//       onEndDateUpdate?.(val);
//       console.log("end", val);
//     },
//     [onEndDateUpdate, minDate, maxDate, left]
//   );

//   return (
//     <div ref={el} className={styles.bar} style={{ width: right - left, left }}>
//       <div>
//         <DateSlider onChange={handleStartDateChange} />
//         <ProgressBar
//           disableProgressUpdate={disableProgressUpdate}
//           onChange={onProgressUpdate}
//           progress={progress}
//         />
//         <DateSlider onChange={handleEndDateChange} />
//       </div>
//       <h4>{name}</h4>
//     </div>
//   );
// }

// const DateSlider = memo(({ onChange }) => {
//   const el = useMouseMove((ev) => {
//     const w = ev.clientX - el.current.clientWidth / 2;
//     onChange?.(w);
//   });

//   return <span ref={el} className={styles.slider} />;
// });

// const ProgressBar = memo(({ progress, onChange, disableProgressUpdate }) => {
//   const rootEl = useRef();

//   const sliderEl = useMouseMove((ev) => {
//     const w = ev.clientX - rootEl.current.clientWidth / 2;
//     // console.log(w, sliderEl.current.clientWidth);
//     // if (w > el.current.clientWidth) return;
//     onChange?.(w - rootEl.current.style.left);
//     rootEl.current.style.left = w + "px";
//   });

//   return (
//     <div
//       ref={rootEl}
//       className={styles.progress}
//       style={{ width: progress + "%" }}
//     >
//       {!disableProgressUpdate && <span ref={sliderEl}>&#x25B2;</span>}
//     </div>
//   );
// });
