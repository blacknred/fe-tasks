import { useRef } from "react";
import { flushSync } from "react-dom";
import { IIssue, IIssueFilters, ISprint } from "../../types";
import styles from './Backlog.module.css';
import { BacklogSection } from "./BacklogSection";
import { Header } from "./Header";
import { SprintSection, SprintSectionRef } from "./SprintSection";

export type BacklogProps = {
  projectId: string;
};

export type SectionRef = {
  filter: (filters: IIssueFilters) => void;
  remove: (draggableIdx: string) => IIssue | undefined;
  add: (issue: IIssue, droppableIdx: string) => void;
}

export function Backlog({ projectId }: BacklogProps) {
  const sprintRef = useRef<SectionRef>(null);
  const backlogRef = useRef<SectionRef>(null);
  const sprintSectionRef = useRef<SprintSectionRef>(null);


  const handleItemShift = (sprintId?: string) => (draggableId: string, droppableIdx: string) => {
    // @ts-ignore smooth dom updates
    document.startViewTransition(() => {
      flushSync(() => {
        if (sprintId) {
          let issue = backlogRef.current?.remove(draggableId);
          if (!issue) issue = sprintRef.current?.remove(draggableId);
          if (!issue) return;
          issue.sprintId = sprintId;
          sprintRef.current?.add(issue, droppableIdx);
        } else {
          let issue = sprintRef.current?.remove(draggableId);
          if (!issue) issue = backlogRef.current?.remove(draggableId);
          if (!issue) return;
          issue.sprintId = undefined;
          backlogRef.current?.add(issue, droppableIdx);
        }
      })
    });

    // TODO: update on be
  }

  return (
    <>
      <Header
        projectId={projectId}
        onSprintSelect={(sprint: ISprint) => sprintSectionRef.current?.update(sprint)}
        onFilterChange={(filters: IIssueFilters) => {
          backlogRef.current?.filter?.(filters);
          sprintRef.current?.filter?.(filters);
        }}
      />
      <br />
      <main className={styles.grid}>
        <SprintSection
          innerRef={sprintRef}
          projectId={projectId}
          onDropItem={handleItemShift}
          ref={sprintSectionRef}
        />
        <BacklogSection
          innerRef={backlogRef}
          projectId={projectId}
          onDropItem={handleItemShift}
        />
      </main>
    </>
  )
}
