import prisma from "@/db/client";
import { Post, User } from "../../../generated/prisma";

// export type PostWithMedia = Awaited<ReturnType<typeof getPostByUserId>>;
export async function getPostByUserId(userId: string) {
  return await prisma.post.findMany({
    where: {
      userId,
      img: {
        not: null,
      }
    },
    take: 8,
    orderBy: {
      createdAt: "desc",
    },
  })
}

export type PostWithCount = {
  _count: { likes: number; comments: number };
  user: User;
  likes: {userId: string}[]
} & Post
export async function getPostsByUsername(username: string): Promise<PostWithCount[]> {
  return await prisma.post.findMany({
    where: {
      user: {
        username,
      },
    },
    include: {
      user: true,
      likes: {
        select: {
          userId: true,
        }
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}


export async function getFollowingPostsByUserId(userId: string): Promise<PostWithCount[]>{
  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }, // 只取关注对象的ID
  });

  return await prisma.post.findMany({
    where: {
      userId: { in: followings.map((f) => f.followingId) }, // 查询这些用户的帖子
    },
    include: {
      user: true,
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}