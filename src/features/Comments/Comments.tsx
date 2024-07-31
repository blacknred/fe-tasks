import { useState } from "react";
import styles from "./Comments.module.css";
import { useComments } from "./api";
import { CommentList } from "./components/CommentList";
import { Paginated } from "./components/Paginated";
import { transformComments } from "./utils";

export function Comments() {
  const [viewMode, setViewMode] = useState<1 | 2 | 3>(1);
  const [data, _, isFetching, refetch] = useComments();

  function renderContent() {
    if (isFetching) return "Loading...";
    if (!data) return;

    const transformedData = transformComments(data, viewMode);

    if (viewMode === 1) {
      return <CommentList data={transformedData} />;
    }

    if (viewMode === 2) {
      return (
        <Paginated total={data.length}>
          {(f, t) => <CommentList data={transformedData.slice(f, t)} />}
        </Paginated>
      );
    }

    return <div />;
  }

  return (
    <>
      <h1>Comments</h1>
      <header className={styles.header}>
        <button onClick={() => setViewMode(1)}>Collapsed</button>
        <button onClick={() => setViewMode(2)}>Pagination</button>
        <button onClick={() => setViewMode(3)}>Virtualization</button>
        <button onClick={() => refetch(true)}>refetch</button>
      </header>
      <br />
      <main className={styles.main}>{renderContent()}</main>
    </>
  );
}
