// import { useEffect, useRef, useState, ReactNode } from "react";
// import styles from "./Comments.module.css";
// import { debounce } from "../../utils/debounce";

// export function VirtualizedList<Type>({
//   items,
//   count = 10,
//   renderItem,
// }: {
//   items: Type[];
//   count?: number;
//   renderItem: (item: Type) => ReactNode;
// }) {
//   const [indexes, setIndexes] = useState([0, count]);
//   // const [currentItems, seCurrentItems] = useState<Type[]>(
//   //   items.slice(0, count)
//   // );
//   const lastEl = useRef();
//   const position = useRef(0);

//   useEffect(() => {
//     const scrollHandler = debounce(function (e) {
//       const { scrollTop } = e.target.scrollingElement;
//       if (scrollTop > position.current) {
//         console.log("down");
//         setIndexes((prev) => [prev[0] + 1, prev[1] + 1]);
//       } else {
//         console.log("up");
//         setIndexes((prev) => [prev[0] - 1, prev[1] - 1]);
//       }
//       position.current = scrollTop;
//     });

//     window.addEventListener("scroll", scrollHandler);
//     // const observer = new IntersectionObserver(
//     //   (entries) => {
//     //     if (entries[0].isIntersecting) {
//     //       if (indexes[1] > items.length) return;
//     //       console.log("add to end");
//     //       setIndexes(([start, last]) => [start + count, last + count]);
//     //     } else {
//     //       console.log("add to begin");
//     //       setIndexes(([start, last]) => [start - count, last - count]);
//     //     }
//     //   },
//     //   { root: document.ul }
//     // );

//     // observer.observe(lastEl.current);

//     // return () => observer.disconnect(lastEl.current);
//     return () => window.removeEventListener("scroll", scrollHandler);
//   }, []);

//   return (
//     <ul
//       id="ul"
//       className={styles}
//       // style={{ height: "500px" }}
//       // ref={(e) => (El.current = e)}
//     >
//       {items.slice(indexes[0], indexes[1]).map(renderItem)}
//       <li ref={(el) => (lastEl.current = el)} />
//     </ul>
//   );
// }
