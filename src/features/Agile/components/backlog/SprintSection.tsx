import { forwardRef, Fragment, Ref, useImperativeHandle, useState } from "react";
import { useSprintIssues } from "../../api/getIssues";
import { useSprints } from "../../api/getSprints";
import { ISprint } from "../../types";
import { DropArea } from "../DropArea";
import { SectionRef } from "./Backlog";
import { Item } from "./Item";

export type SprintSectionProps = {
  projectId: string;
  childRef?: Ref<SectionRef>;
  onDrop: (draggableId: string, droppableId: string) => void;
}

export function SprintSection({ projectId, onDrop, childRef }: SprintSectionProps) {
  const [currentSprintIndex, setCurrentSprintIndex] = useState(0);
  const [sprints] = useSprints(projectId);
  console.table(sprints);

  if (!sprints) return null;
  if (!sprints[currentSprintIndex]) return 'No sprints found';

  return (
    <section>
      <header>
        <h3>{sprints[currentSprintIndex].name}</h3>
        <select onChange={(e) => setCurrentSprintIndex(+e.target.value)} placeholder="Select sprint">
          {sprints.map((sprint, idx) => <option key={sprint.id} value={idx}>{sprint.name}</option>)}
        </select>
      </header>

      <SprintIssues ref={childRef} {...sprints[currentSprintIndex]} onDrop={onDrop} />
    </section>
  )
}

type SprintIssuesProps = ISprint & SprintSectionProps;

const SprintIssues = forwardRef<SectionRef, SprintIssuesProps>(({ projectId, id, onDrop }, ref) => {
  const [sprintIssues] = useSprintIssues(projectId, id);
  console.table(sprintIssues);

  const [issues, setIssues] = useState(sprintIssues);

  useImperativeHandle(ref, () => ({
    remove(draggableId) {
      if (issues === undefined) return;
      const idx = issues.findIndex(issue => issue.id == draggableId);
      if (idx === -1) return;
      const issue = issues[idx];
      const head = issues.slice(0, idx);
      const tail = issues.slice(idx + 1, issues.length);
      setIssues([...head, ...tail]);
      return issue;
    },
    add(issue, droppableIdx) {
      setIssues(prev => {
        if (!prev) return prev;
        const head = prev.slice(0, +droppableIdx);
        const tail = prev.slice(+droppableIdx, prev.length);
        return [...head, issue, ...tail];
      })
    }
  }), [])

  return (
    <ul>
      <DropArea id={0} onDrop={onDrop} />
      {issues?.map((task, idx) => (
        <Fragment key={task.id}>
          <Item {...task} />
          <DropArea id={idx + 1} onDrop={onDrop} />
        </Fragment>
      ))}
    </ul>
  )
})