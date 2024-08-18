import { Fragment, useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useBoard } from "../../api/getBoard";
import { useBoardIssues, } from "../../api/getIssues";
import { useStatusses } from "../../api/getStatusses";
import { ID, IIssueFilters } from "../../types";
import { Column, ColumnRef } from "../column/Column";
import { DropArea } from "../dropArea/DropArea";
import styles from "./Board.module.css";
import { Card } from "./Card";
import { Header } from "./Header";

export type BoardProps = {
  projectId: ID;
};

export function Board({ projectId }: BoardProps) {
  const { data: board, isFetching, mutate: mutateBoard } = useBoard(projectId);
  const { data: issues, mutate: mutateIssues } = useBoardIssues(projectId);
  const { data: statusses } = useStatusses(projectId);

  const [isEditable, setIsEditable] = useState(false);
  const refs = useRef<Record<string, ColumnRef | null>>({});

  const handleEditingChange = useCallback(async () => {
    if (!board) return;
    setIsEditable(prev => {
      if (prev) {
        const revert = mutateBoard(board);
        // TODO: update request; if request fails, revert optimistic update otherwise refetch board
        // setTimeout(revert, 5000, true);
      }
      return !prev;
    })
  }, [board])

  const handleColumnRemove = useCallback((name: string) => {
    if (!board) return;
    const columns = board.columns.filter((c) => c.name !== name);
    const optimisticData = { ...board, columns };
    mutateBoard(optimisticData);
  }, [board, mutateBoard])

  const handleColumnShift = useCallback((prevIdx: string, nextIdx: string) => {
    if (!board) return;
    const { columns } = board;
    const [column] = columns.splice(+prevIdx, 1);
    columns.splice(+nextIdx, 0, column);
    const optimisticData = { ...board, columns };
    mutateBoard(optimisticData);
  }, [board, mutateBoard]);

  const handleFilterChange = useCallback((filters: IIssueFilters) => {
    Object.values(refs.current).forEach(ref => ref?.filter(filters))
  }, [])

  const handleCardShift = useCallback((status: string) => (id: string, nextIdx: string) => {
    if (!issues) return;

    for (let col in issues) {
      if (issues[col].every((t) => t.id != id)) continue;

      // @ts-ignore smooth dom updates
      document.startViewTransition(() => {
        flushSync(() => {
          const idx = issues[col].findIndex(issue => issue.id == id);
          if (idx === -1) return;
          const items = structuredClone(issues);
          const [item] = items[col].splice(idx, 1);
          item.status = status;
          items[status].splice(+nextIdx, 0, item);

          const revert = mutateIssues(items);
          // TODO: update request; if request fails, revert optimistic update otherwise refetch issues
          // setTimeout(revert, 5000);
        })
      });
    }


  }, [issues, mutateIssues]);

  if (isFetching) return null;

  return (
    <>
      <Header
        projectId={projectId}
        onFilterChange={handleFilterChange}
        isEditable={isEditable}
        onEdit={handleEditingChange}
      />
      <br />

      <main className={styles.grid}>
        <DropArea id={0} onDrop={handleColumnShift} disabled={!isEditable} />

        {board?.columns.map((column, idx) => (
          <Fragment key={column.name}>
            <Column
              idx={idx}
              ref={ref => refs.current[column.status] = ref}
              name={column.name}
              items={issues?.[column.status]}
              editable={isEditable}
              onDropItem={handleCardShift(column.status)}
              onRemove={handleColumnRemove}
              ItemComponent={Card}
            />

            <DropArea id={idx + 1} onDrop={handleColumnShift} disabled={!isEditable} />
          </Fragment>
        ))}

        <div className={styles.statusList}>
          <ul>
            {isEditable
              ? statusses?.filter((s) => board?.columns.every(c => c.status !== s.name)).map(({ name }) => (
                <li key={name} onClick={() => {
                  if (!board) return;
                  const columns = [...board.columns, { name, status: name, issueOrder: {} }];
                  const optimisticData = { ...board, columns }
                  mutateBoard(optimisticData);
                }}
                >
                  {name.toUpperCase()}
                </li>
              ))
              : null}
          </ul>
        </div>
      </main>
    </>
  );
}
