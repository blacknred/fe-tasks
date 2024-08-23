import { ChangeEvent, memo, useRef } from "react";
import { useEpics } from "../../api/getIssues";
import { SectionRef } from "./Backlog";
import styles from './Backlog.module.css';
import { IIssueFilters } from "../../types";
import { useActiveSprint, useSprints } from "../../api/getSprints";
import { SprintSectionRef } from "./SprintSection";

export type HeaderProps = {
  projectId: string;
  onFilterChange: SectionRef['filter'];
  onSprintSelect: SprintSectionRef['update'];
}

export const Header = memo(({ projectId, onFilterChange, onSprintSelect }: HeaderProps) => {
  const { data: epics } = useEpics(projectId);
  const { data: sprints } = useSprints(projectId);
  const { data: activeSprint } = useActiveSprint(projectId);

  const ref = useRef<IIssueFilters>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!ref.current) return;
    //@ts-ignore
    ref.current[e.target.name] = e.target.value;
    onFilterChange?.(ref.current);
  }

  return (
    <header className={styles.header}>
      <input name="search" onChange={handleChange} placeholder="Search"></input>
      <select name='epicId' onChange={handleChange}>
        <option value={''}>Any epic</option>
        {epics?.map(epic => <option key={epic.id}>{epic.id}</option>)}
      </select>
      <select onChange={(e) => {
        if (!sprints) return;
        onSprintSelect(sprints[+e.target.value]);
      }} placeholder="Select sprint" defaultValue={activeSprint?.id}>
        {sprints?.map((sprint, idx) => <option key={sprint.id} value={sprint.id}>{sprint.name}</option>)}
      </select>
      <button onClick={() => console.log('create sprint')}>
        Create sprint
      </button>
    </header>
  )
})