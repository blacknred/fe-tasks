import { memo } from "react";
import { useEpics } from "../../api/getIssues";
import { SectionRef } from "./Backlog";
import styles from './Backlog.module.css';

export type HeaderProps = {
  projectId: string;
  onFilterChange?: SectionRef['filter'];
  onSprintCreated?: () => void;
}

export const Header = memo(({ projectId, onFilterChange }: HeaderProps) => {
  const [epics] = useEpics(projectId);

  return (
    <header className={styles.header}>
      <h2>Backlog</h2>
      <input name='search' onChange={(e) => onFilterChange?.('search', e.target.value)} placeholder="Search"></input>
      <select name='epicId' onChange={(e) => onFilterChange?.('epicId', e.target.value)} placeholder="Select epic">
        {epics?.map(epic => <option key={epic.id}>{epic.name}</option>)}
      </select>
      <button onClick={() => console.log('create sprint')}>
        Create sprint
      </button>
    </header>
  )
})