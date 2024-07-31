import { ReactElement } from "react";
import { CommentItem } from "./CommentItem";
import type { IComment } from "../types";

type ListProps<Type> = {
  items: Type[];
  renderItem: (item: Type) => ReactElement;
};

function List<Type>({ items, renderItem }: ListProps<Type>) {
  return <ul>{items.map(renderItem)}</ul>;
}

type CommentListProps = {
  data: IComment[];
};

export const CommentList = ({ data }: CommentListProps) => (
  <List<IComment>
    items={data}
    renderItem={(item) => <CommentItem key={item.id} {...item} />}
  />
);
