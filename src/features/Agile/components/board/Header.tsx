import { ChangeEvent, memo, SetStateAction, useRef } from "react";
import { useUsers } from "../../api/getUsers";
import { IBoard, ID, IIssueFilters, IssuePriority, IssueType } from "../../types";
import styles from './Board.module.css';
import { useStatusses } from "../../api/getStatusses";

export type HeaderProps = {
  epics: ID[];
  isEditable: boolean;
  onEdit: () => void;
  board: IBoard;
  onUpdate: (action: SetStateAction<IBoard>) => void
  onFilter: (filters: IIssueFilters) => void;
}

export const Header = memo(({ board, epics, isEditable, onUpdate, onFilter, onEdit }: HeaderProps) => {
  const { data: users } = useUsers(board.projectId);
  const { data: statusses } = useStatusses(board.projectId);

  const ref = useRef<IIssueFilters>(board.filters || {});

  function handleFilterChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    if (!ref.current) return;
    let { name, value } = e.target;

    if (name === 'endAt' || name === 'startAt') {
      ref.current[name] = new Date(value).valueOf();
    } else {
      //@ts-ignore
      ref.current[name] = value;
    }

    onFilter(ref.current);
  }

  function handleFiltersSave() {
    onUpdate(prev => {
      if (!prev) return prev;
      return { ...prev, filters: ref.current }
    })
  }

  function handleColumnAdd(name: string) {
    return function () {
      onUpdate(prev => {
        if (!prev) return prev;
        const columns = [...prev.columns, { name, status: name, issueOrder: {} }]
        return { ...prev, columns }
      })
    }
  }

  return (
    <header className={styles.header}>
      <div>
        <input name="search" onChange={handleFilterChange} placeholder="Search by title"></input>
        <select name="epicId" onChange={handleFilterChange}>
          <option value={''}>Any epic</option>
          {epics?.map(epic => <option key={epic}>{epic}</option>)}
        </select>
        <select name="priority" onChange={handleFilterChange} >
          <option value={''}>Any priority</option>
          {Object.values(IssuePriority).map(priority => <option key={priority}>{priority}</option>)}
        </select>
        <select name="type" onChange={handleFilterChange}>
          <option value={''}>Any type</option>
          {Object.values(IssueType).map(type => <option key={type}>{type}</option>)}
        </select>
        <select name="assigneeId" onChange={handleFilterChange}>
          <option value={''}>Any assignee</option>
          {users?.map(user => <option key={user.id} value={user.id}>{user.fullname}</option>)}
        </select>
        <input name="startAt" type='date' onChange={handleFilterChange}></input>
        <input name="endAt" type='date' onChange={handleFilterChange}></input>

        {isEditable && <button onClick={handleFiltersSave}>Save filters</button>}
        <button onClick={onEdit}>{isEditable ? 'Save' : 'Edit'} board</button>
      </div>

      <br />

      <ul className={styles.statusList}>
        {isEditable
          ? statusses?.filter((s) => board?.columns.every(c => c.status !== s.name)).map(({ name }) => (
            <li key={name} onClick={handleColumnAdd(name)}> + {name.toUpperCase()}</li>
          ))
          : null}
      </ul>
    </header>
  )
})