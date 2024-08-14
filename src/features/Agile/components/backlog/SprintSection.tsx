import { useState } from "react";
import { useSprintTasks } from "../../api/getTasks";

type SprintSectionProps = {
  projectId: string;
  id: string;
  name: string;
}
export function SprintSection({ projectId, id, name }: SprintSectionProps) {
  const [data] = useSprintTasks(projectId, id);

  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState(data);

  return (
    <section>
      <header onClick={() => setIsOpen(!isOpen)}><h3>{name}</h3></header>
      {isOpen && (
        <ul>
          {tasks?.map((task) => <li key={task.id}>{task.title}</li>)}
        </ul>
      )}
    </section>
  )
}