// import React from "react";

// // [], key = null
// // [].foreach(v => v[parentId] === key ? res.push)

// // function makeTree<T extends { id: number, parentId: number }, R extends T && { children: R[] }>(arr: T[]) {
// //   const stack: T[] = arr.filter(r => p.parentId === null);
// //   const result: R[] = [];
// //   while (stack.length > 0) {
// //     const r = stack.pop()!;

// //   }

// //   return result;
// // }

// const First = () => {
//   const listData = [
//     { id: 1, name: "Element 1", parentId: null },
//     { id: 2, name: "Element 2", parentId: 1 },
//     { id: 3, name: "Element 3", parentId: 2 },
//     { id: 4, name: "Element 4", parentId: 3 },
//     { id: 5, name: "Element 5", parentId: 2 },
//     { id: 6, name: "Element 6", parentId: 4 },
//     { id: 7, name: "Element 7", parentId: 1 },
//     { id: 8, name: "Element 8", parentId: null },
//     { id: 9, name: "Element 9", parentId: 4 },
//     { id: 10, name: "Element 10", parentId: 8 },
//     { id: 11, name: "Element 11", parentId: 2 },
//     { id: 12, name: "Element 12", parentId: 5 },
//     { id: 14, name: "Element 14", parentId: 3 },
//     { id: 15, name: "Element 15", parentId: 9 },
//     { id: 17, name: "Element 17", parentId: 7 },
//     { id: 18, name: "Element 18", parentId: 14 },
//     { id: 19, name: "Element 19", parentId: 8 },
//     { id: 20, name: "Element 20", parentId: 16 },
//     { id: 22, name: "Element 22", parentId: 17 },
//     { id: 24, name: "Element 24", parentId: 20 },
//     { id: 25, name: "Element 25", parentId: 12 },
//     { id: 26, name: "Element 26", parentId: 22 },
//     { id: 27, name: "Element 27", parentId: 6 },
//     { id: 28, name: "Element 28", parentId: 10 },
//     { id: 29, name: "Element 29", parentId: 18 },
//     { id: 30, name: "Element 30", parentId: 27 },
//   ];

//   // const highestElements = listData.filter((el) => el.parentId === null);

//   function renderList(parentId) {
//     const list = listData.filter((el) => el.parentId === parentId);

//     return (
//       <ul>
//         {list.map((el) => (
//           <ol key={el.id}>
//             {el.name}
//             {renderList(el.id)}
//           </ol>
//         ))}
//       </ul>
//     );
//   }

//   return <>{renderList(null)}</>;
// };

// export default First;
