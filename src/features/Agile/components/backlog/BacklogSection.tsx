import { Ref } from "react";
import { useBacklogStories } from "../../api/getIssues";
import { Column } from "../column/Column";
import { SectionRef } from "./Backlog";
import { Item } from "./Item";

export type SprintSectionProps = {
  projectId: string;
  innerRef?: Ref<SectionRef>;
  onDropItem: (sprintId?: string) => (draggableId: string, droppableId: string) => void;
}

export function BacklogSection({ projectId, onDropItem, innerRef }: SprintSectionProps) {
  const { data: backlogStories } = useBacklogStories(projectId);

  if (!backlogStories) return null;

  return (
    <Column
      idx={0}
      ref={innerRef}
      name={'Backlog'}
      items={backlogStories}
      onDropItem={onDropItem()}
      onUpdateItem={console.log}
      ItemComponent={Item}
    />
  )
}
