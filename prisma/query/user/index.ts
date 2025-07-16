import prisma from "@/db/client";
import { User } from "../../../generated/prisma";
// import { User } from "@clerk/nextjs/server";
// import { FollowRequest } from "../../../generated/prisma";

export interface ClerkUser {
  id: string;
  username?: string | null;
  last_name?: string | null;
  image_url?: string | null;
  // 其他可能的 Clerk 用户字段...
}

export async function addUser(clerUser: ClerkUser) {
  await prisma.user.create({
    data: {
      id: clerUser.id,
      username: clerUser.username!,
      avatar: clerUser.image_url || "/noAvatar.png",
      cover: "/noCover.png",
    },
  });
}

export async function updateUser(clerUser: ClerkUser) {
  await prisma.user.update({
    where: {
      id: clerUser.id,
    },
    data: {
      username: clerUser.username!,
      avatar: clerUser.image_url || "/noAvatar.png",
    },
  })
}


export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      // 也返回该用户作为followers, following, posts的数量
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true
        }
      }
    }
  });
}

export async function getUserByIdPlain(id: string):Promise<User | null> {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

// export type ReturnUser = {
//   _count: { followers: number, following: number, posts: number }
// } & User | null;

export type UserWithCount = Awaited<ReturnType<typeof getUserByUsername>>;
export async function getUserByUsername(username: string){
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      // 也返回该用户作为followers, following, posts的数量
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
  return user;
}


export async function isUserBlocked(currentUserId: string, searchUserId: string) {
  const block = await prisma.block.findFirst({
    where: {
      blockerId: searchUserId,
      blockedId: currentUserId,
    },
  })
  return !!block;
}

export async function isCurrentUserBlocked(currentUserId: string, searchUserId: string) {
  const block = await prisma.block.findFirst({
    where: {
      blockerId: currentUserId,
      blockedId: searchUserId,
    },
  });
  return !!block;
}



export async function isUserFollowing(currentUserId: string, searchUserId: string) {
  const follow = await prisma.follow.findFirst({
    where: {
      followerId: currentUserId,
      followingId: searchUserId,
    },
  })
  return !!follow;
}

export async function isFollowRequestSent(currentUserId: string, searchUserId: string) { 
  const request = await prisma.followRequest.findFirst({
    where: {
      senderId: currentUserId,
      receiverId: searchUserId,
    },
  })

  return !!request;

}


export type RequestWithUser = Awaited<ReturnType<typeof getFollowRequestsByUserId>>
// export type RequestWithUser = FollowRequest & { sender: User }

export async function getFollowRequestsByUserId(userId: string) {
  return await prisma.followRequest.findMany({
    where: {
      receiverId: userId,
    },
    include: {
      sender: true,
    },
  })
}

