import prisma from "@/db/client";
import { Comment, User } from "../../../generated/prisma";

export type CommentsWithUser = Comment & { user: User }
export async function getCommentsByPostId(postId: number): Promise<CommentsWithUser[]> {
  return await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      user: true,
    },
  });
}