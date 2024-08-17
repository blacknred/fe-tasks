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
    remove(id) {
      if (!issues) return;
      const idx = issues.findIndex(issue => issue.id == id);
      if (idx === -1) return;
      const [issue] = issues.splice(idx, 1);
      setIssues([...issues]);
      return issue;
    },
    add(issue, idx) {
      setIssues(prev => {
        if (!prev) return prev;
        prev.splice(+idx, 0, issue);
        return [...prev];
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