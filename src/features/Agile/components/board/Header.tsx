import { Dispatch, memo, SetStateAction } from "react";
import { useEpics } from "../../api/getIssues";
import { useUsers } from "../../api/getUsers";
import { IssuePriority, IssueType } from "../../types";
import styles from './Board.module.css';

export type HeaderProps = {
  projectId: string;
  onSearch: (text: string) => void;
  onEpicChange: (epicId: string) => void;
  onTypeChange: (type: string) => void;
  onPriorityChange: (priority: string) => void;
  onAssigneeChange: (assigneeId: string) => void;
  onEdit: Dispatch<SetStateAction<boolean>>;
  onIssueCreated: () => void;
}

export const Header = memo(({ projectId, onSearch, onEpicChange, onAssigneeChange, onPriorityChange, onTypeChange, onEdit, onIssueCreated }: HeaderProps) => {
  const [epics] = useEpics(projectId);
  const [users] = useUsers(projectId);
  console.table(epics)
  console.table(users)

  return (
    <header className={styles.header}>
      <h2>Backlog</h2>
      <input onChange={(e) => onSearch(e.target.value)} placeholder="Search"></input>
      <select onChange={(e) => onEpicChange(e.target.value)} placeholder="Select epic">
        {epics?.map(epic => <option key={epic.id}>{epic.name}</option>)}
      </select>
      <select onChange={(e) => onPriorityChange(e.target.value)} placeholder="Select priority">
        {Object.values(IssuePriority).map(priority => <option key={priority}>{priority}</option>)}
      </select>
      <select onChange={(e) => onTypeChange(e.target.value)} placeholder="Select type">
        {Object.values(IssueType).map(type => <option key={type}>{type}</option>)}
      </select>
      <select onChange={(e) => onAssigneeChange(e.target.value)} placeholder="Select assignee">
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