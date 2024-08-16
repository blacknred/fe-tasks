import { useRef } from "react";
import { IIssue, IIssueFilters } from "../../types";
import { BacklogSection } from "./BAcklogSection";
import { Header } from "./Header";
import { SprintSection } from "./SprintSection";

export type BacklogProps = {
  projectId: string;
};

export type SectionRef = {
  filter?: (filter: keyof IIssueFilters, value: string) => void;
  remove: (draggableIdx: string) => IIssue | undefined;
  add: (issue: IIssue, droppableIdx: string) => void;
}

export function Backlog({ projectId }: BacklogProps) {
  const sprintRef = useRef<SectionRef>(null);
  const backlogRef = useRef<SectionRef>(null);

  const onDrop = (section: 'sprint' | 'backlog') => (draggableId: string, droppableIdx: string) => {
    let target = section === 'sprint' ? backlogRef : sprintRef;
    let issue = target.current?.remove(draggableId);

    if (!issue) {
      target = section === 'sprint' ? sprintRef : backlogRef;
      issue = target.current?.remove(draggableId);
    }

    if (!issue) return;
    target.current?.add(issue, droppableIdx);
    // TODO: update on be
  }

  return (
    <>
      <Header
        projectId={projectId}
        onFilterChange={backlogRef.current?.filter}
        onSprintCreated={console.log}
      />
      <br />
      <main>
        <SprintSection
          childRef={sprintRef}
          projectId={projectId}
          onDrop={onDrop('backlog')}
        />
        <BacklogSection
          ref={backlogRef}
          projectId={projectId}
          onDrop={onDrop('backlog')}
        />
      </main>
    </>
  )
}
