import { useState, useEffect, ReactElement } from "react";

type PaginatedProps = {
  children: (first: number, last: number) => ReactElement;
  total: number;
};

export function Paginated({ total, children }: PaginatedProps) {
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(10);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <>
      {children((page - 1) * count, page * count)}
      <div>
        <div>
          {Array(Math.floor(total / count))
            .fill(0)
            .map((_, idx) => (
              <button key={idx} onClick={() => setPage(idx + 1)}>
                {idx + 1 === page ? <strong>{idx + 1}</strong> : idx + 1}
              </button>
            ))}
        </div>
        <br />
        <label htmlFor="count">Set count per page</label>
        <select
          id="count"
          defaultValue={count}
          onChange={(e) => {
            console.log(e.target.value);
            setCount(+e.target.value);
            setPage(1);
          }}
        >
          <option value={10}>10</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>
    </>
  );
}
