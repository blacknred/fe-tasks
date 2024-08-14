import { useEpics } from "../../api/getEpics";
import { useSprints } from "../../api/getSprints";
import { useBacklogTasks } from "../../api/getTasks";
import { SprintSection } from "./SprintSection";

export type BacklogProps = {
  projectId: string;
};

export function Backlog({ projectId }: BacklogProps) {
  const [epics] = useEpics(projectId);
  const [sprints] = useSprints(projectId);
  const [tasks, _, isPending, refetch] = useBacklogTasks(projectId);

  console.table(epics)
  console.table(sprints)
  console.table(tasks)

  return (
    <>
      <header><h2>Backlog</h2></header>

      <aside>
        <ul>{epics?.map(epic => <li key={epic.id}>{epic.name}</li>)}
        </ul>
      </aside>

      <main>
        {sprints?.map((sprint) => <SprintSection key={sprint.id} {...sprint} />)}

        <section>
          <header><h3>Backlog</h3></header>
          <ul>
            {tasks?.map((task) => (
              <article key={task.id}>
                <p>{task.title}</p>
              </article>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
