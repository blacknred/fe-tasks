export type IComment = {
    postId: number;
    id: number;
    name: string;
    body: string;
    children?: IComment[];
    parent?: IComment;
  };