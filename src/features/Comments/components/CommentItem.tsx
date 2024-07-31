import { useState } from "react";
import type { IComment } from "../types";
import { CommentList } from "./CommentList";

export function CommentItem(props: IComment) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <li>
      <div>
        <div>
          <h2>{props.name[0].toUpperCase()}</h2>
        </div>
      </div>
      <div>
        <h4>{props.name}</h4>
        {!!props.parent && <CommentItem {...props.parent} />}
        <p>{props.body}</p>
        {!!props.children?.length && (
          <>
            <CommentList
              data={isCollapsed ? props.children.slice(0, 1) : props.children}
            />
            {props.children.length > 1 && (
              <button onClick={() => setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? "View all" : "Hide"}
              </button>
            )}
          </>
        )}
      </div>
    </li>
  );
}
