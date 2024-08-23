// import { memo } from "react";
// import { useDrag } from "../../../../hooks/useDrag";
// import { IIssue } from "../../types";
// import styles from './Board.module.css';

// export type CardProps = IIssue & {
//   disabled?: boolean
// };

// export const Card = memo(({ id, title, type, assignee, priority, disabled, tags }: CardProps) => {
//   const draggable = useDrag(undefined, disabled ? null : styles.drag);

//   return (
//     // @ts-ignore
//     <li id={id} ref={draggable} className={styles.card}>
//       <p>{title}</p>
//       <div> <span data-priority={priority}>{priority}</span></div>
//       <br />
//       <div>
//         <span>
//           <span data-type={type} />
//           <span>{id}</span>
//         </span>
//         <img src={assignee?.image} />
//       </div>
//     </li>
//   );
// })