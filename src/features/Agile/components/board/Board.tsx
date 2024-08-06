export function Board() {
  return <p>Board</p>;
}

// import { useState } from "react";
// import { useDrag, useDrop } from "./useDnd";
// import { getTasks, STATUSSES } from "./util";

// function Card({ data }) {
//   const draggable = useDrag();

//   return (
//     <li
//       id={data.id}
//       ref={draggable}
//       style={{
//         padding: 30,
//         border: "1px solid #bbb",
//         marginBottom: 10,
//         cursor: "pointer",
//         backgroundColor: "lightyellow",
//       }}
//     >
//       {data.title}---[{data.id}]-[{data.boardOrder}]
//     </li>
//   );
// }

// function CardList({ name, tasks, setTasks }) {
//   const dropZone = useDrop((dragElId, dropElId) => {
//     if (dragElId === dropElId) return;
//     setTasks((prev) => {
//       const idx = prev.findIndex((p) => p.id == dragElId);
//       prev[idx].status = name;

//       if (dropElId !== name) {
//         console.log(66);
//         const replacedTaskIdx = prev.findIndex((p) => p.id == dropElId);
//         const replacedBoardOrder = prev[replacedTaskIdx].boardOrder;

//         // swap boardOrder with replaced task
//         prev[idx].boardOrder = replacedBoardOrder;
//         prev[replacedTaskIdx].boardOrder = replacedBoardOrder + 1;

//         // enlarge boardOrder for all tasks after replaced for order consistency
//         tasks.forEach((t) => {
//           if (t.boardOrder < replacedBoardOrder) return;
//           const i = prev.findIndex((p) => p.id == t.id);
//           prev[i].boardOrder = prev[i].boardOrder + 1;
//         });
//       }

//       return [...prev];
//     });
//   }, "act");

//   return (
//     <ul
//       ref={dropZone}
//       id={name}
//       style={{
//         padding: 10,
//         margin: 0,
//         flex: 1,
//         listStyle: "none",
//       }}
//     >
//       {tasks.map((task) => (
//         <Card key={task.id} data={task} />
//       ))}
//     </ul>
//   );
// }

// function Column(props) {
//   const draggable = useDrag();

//   return (
//     <div
//       ref={draggable}
//       id={props.name}
//       style={{
//         flex: 1,
//         border: "1px solid #aaaaaa",
//         display: "flex",
//         flexDirection: "column",
//       }}
//     >
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           cursor: "pointer",
//         }}
//       >
//         <p>
//           {props.name.toUpperCase()}: {props.tasks.length}
//         </p>
//         <span
//           onClick={() =>
//             props.setColumns((prev) => prev.filter((p) => p !== name))
//           }
//         >
//           x
//         </span>
//       </div>
//       <CardList {...props} />
//     </div>
//   );
// }

// export default function Board() {
//   const [columns, setColumns] = useState(STATUSSES.slice(0, 3));
//   const [tasks, setTasks] = useState(() => getTasks(10));
//   const dropZone = useDrop((dragElId, dropElId) => {
//     console.log(777, dragElId, dropElId);
//     // setTasks((prev) => {
//     //   const idx = prev.findIndex((p) => p.id == dragElId);
//     //   prev[idx].status = name;
//     //   if (dropElId !== name) {
//     //     console.log(66);
//     //     const i = prev.findIndex((p) => p.id == dropElId);
//     //     prev[idx].boardOrder = prev[i].boardOrder;
//     //     prev[i].boardOrder = prev[i].boardOrder + 1;
//     //   }
//     //   return [...prev];
//     // });
//   }, "act");

//   return (
//     <div
//       className="App"
//       style={{ display: "flex", gap: "1rem" }}
//       ref={dropZone}
//     >
//       {columns.map((column) => (
//         <Column
//           key={column}
//           name={column}
//           setTasks={setTasks}
//           tasks={tasks
//             .filter((t) => t.status === column)
//             .sort((a, b) => a.boardOrder - b.boardOrder)}
//           setColumns={setColumns}
//         />
//       ))}
//       <ul
//         style={{
//           listStyle: "none",
//           display: "flex",
//           gap: 10,
//           flexDirection: "column",
//           cursor: "pointer",
//           padding: 0,
//         }}
//       >
//         {STATUSSES.filter((s) => !columns.includes(s)).map((s) => (
//           <li
//             key={s}
//             style={{
//               border: "1px solid #aaaaaa",
//               writingMode: "vertical-lr",
//               padding: 10,
//             }}
//             onClick={() => setColumns((prev) => [...prev, s])}
//           >
//             {s.toUpperCase()}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
