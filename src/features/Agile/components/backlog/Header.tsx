import { ChangeEvent, memo, useRef } from "react";
import { useEpics } from "../../api/getIssues";
import { SectionRef } from "./Backlog";
import styles from './Backlog.module.css';
import { IIssueFilters } from "../../types";

export type HeaderProps = {
  projectId: string;
  onFilterChange?: SectionRef['filter'];
  onSprintCreated?: () => void;
}

export const Header = memo(({ projectId, onFilterChange }: HeaderProps) => {
  const [epics] = useEpics(projectId);
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
        {epics?.map(epic => <option key={epic.id}>{epic.name}</option>)}
      </select>
      <button onClick={() => console.log('create sprint')}>
        Create sprint
      </button>
    </header>
  )
})