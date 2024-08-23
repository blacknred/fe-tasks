// import { Fragment, memo } from 'react';
// import { useDrag } from '../../../../hooks/useDrag';
// import { DropArea } from '../dropArea/DropArea';
// import styles from './Board.module.css';
// import { Card } from './Card';
// import { store, useBoard } from './store';

// export type ColumnProps = {
//   name: string;
//   idx: number;
// };

// export const Column = memo(({ name, idx }: ColumnProps) => {
//   const { isEditable, issues } = useBoard();
//   const draggable = useDrag(undefined, !isEditable ? null : styles.drag);

//   return (
//     // @ts-ignore
//     <div ref={draggable} id={idx} className={styles.column} data-disabled={!isEditable}>
//       <div>
//         <p>{name.toUpperCase()}: {issues?.[name.toLowerCase()]?.length}</p>
//         {isEditable && <span onClick={store.removeColumn(name)}>x</span>}
//         {!isEditable && <span onClick={store.addIssue}>+</span>}
//       </div>
//       <ul>
//         <DropArea id={0} onDrop={store.shiftIssue(name)} disabled={isEditable} />

//         {issues?.[name.toLowerCase()]?.map((card, idx) => (
//           <Fragment key={card.id}>
//             <Card {...card} disabled={isEditable} />
//             <DropArea id={idx + 1} onDrop={store.shiftIssue(name)} disabled={isEditable} />
//           </Fragment>
//         ))}
//       </ul>
//     </div>
//   );
// })