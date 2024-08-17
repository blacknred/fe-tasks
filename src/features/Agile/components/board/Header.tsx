import { Dispatch, memo, SetStateAction } from "react";
import { useEpics } from "../../api/getIssues";
import { useUsers } from "../../api/getUsers";
import { IIssueFilters, IssuePriority, IssueType } from "../../types";
import styles from './Board.module.css';

export type HeaderProps = {
  projectId: string;
  onFilterChange: (filter: keyof IIssueFilters, value: string) => void;
  onEdit: Dispatch<SetStateAction<boolean>>;
  onIssueCreated: () => void;
}

export const Header = memo(({ projectId, onFilterChange, onEdit }: HeaderProps) => {
  const [epics] = useEpics(projectId);
  const [users] = useUsers(projectId);

  return (
    <header className={styles.header}>
      <h2>Backlog</h2>
      <input onChange={(e) => onFilterChange('search', e.target.value)} placeholder="Search"></input>
      <select onChange={(e) => onFilterChange('epicId', e.target.value)} placeholder="Select epic">
        {epics?.map(epic => <option key={epic.id}>{epic.name}</option>)}
      </select>
      <select onChange={(e) => onFilterChange('priority', e.target.value)} placeholder="Select priority">
        {Object.values(IssuePriority).map(priority => <option key={priority}>{priority}</option>)}
      </select>
      <select onChange={(e) => onFilterChange('type', e.target.value)} placeholder="Select type">
        {Object.values(IssueType).map(type => <option key={type}>{type}</option>)}
      </select>
      <select onChange={(e) => onFilterChange('assigneeId', e.target.value)} placeholder="Select assignee">
        {users?.map(user => <option key={user.id} value={user.id}>{user.fullname}</option>)}
      </select>
      <button onClick={() => onEdit(prev => !prev)}>
        <span>&#9881;</span>
      </button>
      <button onClick={() => console.log('create an issue')}>
        Create an issue
      </button>
    </header>
  )
})