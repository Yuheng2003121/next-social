import React from "react";
import { PostWithCount } from "../../../prisma/query/post";
import { getCommentsByPostId } from "../../../prisma/query/comment";
import CommentsList from "./CommentsList";
import { getUserByIdPlain } from "../../../prisma/query/user";

export default async function Comments({post, userId}: {post: PostWithCount, userId: string}) {
  const comments = await getCommentsByPostId(post.id)
  const user = await getUserByIdPlain(userId)//目前登录用户的信息


  return (
    
    <CommentsList comments={comments} postId={post.id} user={user} />
   
  );
}
