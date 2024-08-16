import { forwardRef, Fragment, useImperativeHandle, useState } from "react";
import { useBacklogStories } from "../../api/getIssues";
import { DropArea } from "../DropArea";
import { SectionRef } from "./Backlog";
import { Item } from "./Item";

export type BacklogSectionProps = {
  projectId: string;
  onDrop: (draggableId: string, droppableId: string) => void;
}

export const BacklogSection = forwardRef<SectionRef, BacklogSectionProps>(({ projectId, onDrop }, ref) => {
  const [backlogStories] = useBacklogStories(projectId);
  console.table(backlogStories);

  const [issues, setIssues] = useState(backlogStories);

  useImperativeHandle(ref, () => ({
    filter(filter, value) {
      setIssues((prev) => {
        switch (filter) {
          case 'search': return prev?.filter(t => t.title.includes(value));
          case 'epicId': return prev?.filter(t => 'epicId' in t && t.epicId === value);
          default: return prev;
        }
      })
    },
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
    <section>
      <header><h3>Backlog {issues?.length}</h3></header>

      <ul>
        <DropArea id={0} onDrop={onDrop} />
        {issues?.map((task, idx) => (
          <Fragment key={task.id}>
            <Item {...task} />
            <DropArea id={idx + 1} onDrop={onDrop} />
          </Fragment>
        ))}
      </ul>
    </section>
  )
})