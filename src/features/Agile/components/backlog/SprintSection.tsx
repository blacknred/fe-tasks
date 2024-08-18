import { forwardRef, Ref, useImperativeHandle, useState } from "react";
import { useSprintIssues } from "../../api/getIssues";
import { Column } from "../column/Column";
import { SectionRef } from "./Backlog";
import { Item } from "./Item";
import { ISprint } from "../../types";

export type SprintSectionProps = {
  projectId: string;
  innerRef?: Ref<SectionRef>;
  onDropItem: (sprintId?: string) => (draggableId: string, droppableId: string) => void;
}

export type SprintSectionRef = {
  update: (sprint: ISprint) => void;
}

export const SprintSection = forwardRef<SprintSectionRef, SprintSectionProps>(({ projectId, onDropItem, innerRef }, ref) => {
  const [sprint, setSprint] = useState<ISprint>()
  const { data: issues, refetch } = useSprintIssues(projectId, { sprintId: sprint?.id });
  console.log(sprint?.id, issues?.length)

  useImperativeHandle(ref, () => ({
    update(sprint) {
      setSprint(sprint);
      refetch();
    }
  }), [setSprint])

  if (!sprint) return null;
  if (!issues) return 'No issues found';

  return (
    <Column
      // key={issues.length}
      idx={0}
      ref={innerRef}
      name={sprint.name}
      items={issues}
      onDropItem={onDropItem(sprint.id)}
      ItemComponent={Item}
    />
  )
})
