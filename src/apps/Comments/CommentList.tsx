import { useState, ReactElement } from "react";
import type { IComment } from "./types";

type ListProps<Type> = {
  items: Type[];
  renderItem: (item: Type) => ReactElement;
};

function List<Type>({ items, renderItem }: ListProps<Type>) {
  return <ul>{items.map(renderItem)}</ul>;
}

function Comment(props: IComment) {
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
        {!!props.parent && <Comment {...props.parent} />}
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

export const CommentList = ({ data }: { data: IComment[] }) => (
  <List<IComment>
    items={data}
    renderItem={(item) => <Comment key={item.id} {...item} />}
  />
);
