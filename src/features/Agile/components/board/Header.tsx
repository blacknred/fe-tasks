import { ChangeEvent, memo, useRef } from "react";
import { useEpics } from "../../api/getIssues";
import { useUsers } from "../../api/getUsers";
import { IIssueFilters, IssuePriority, IssueType } from "../../types";
import styles from './Board.module.css';

export type HeaderProps = {
  projectId: string;
  onFilterChange: (filters: IIssueFilters) => void;
  onEdit: () => void;
  isEditable: boolean;
}

export const Header = memo(({ projectId, isEditable, onFilterChange, onEdit }: HeaderProps) => {
  const [epics] = useEpics(projectId);
  const [users] = useUsers(projectId);
  const ref = useRef<IIssueFilters>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!ref.current) return;
    //@ts-ignore
    ref.current[e.target.name] = e.target.value;
    onFilterChange(ref.current);
  }

  return (
    <header className={styles.header}>
      <input name="search" onChange={handleChange} placeholder="Search"></input>
      <select name="epicId" onChange={handleChange}>
        <option value={''}>Any epic</option>
        {epics?.map(epic => <option key={epic.id}>{epic.name}</option>)}
      </select>
      <select name="priority" onChange={handleChange} >
        <option value={''}>Any priority</option>
        {Object.values(IssuePriority).map(priority => <option key={priority}>{priority}</option>)}
      </select>
      <select name="type" onChange={handleChange}>
        <option value={''}>Any type</option>
        {Object.values(IssueType).map(type => <option key={type}>{type}</option>)}
      </select>
      <select name="assigneeId" onChange={handleChange}>
        <option value={''}>Any assignee</option>
        {users?.map(user => <option key={user.id} value={user.id}>{user.fullname}</option>)}
      </select>
      <button onClick={onEdit}>{isEditable ? 'Save' : 'Edit'} board</button>
    </header>
  )
})