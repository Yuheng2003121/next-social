import prisma from "@/db/client";
import { Story, User } from "../../../generated/prisma";

export type StoriesWithUser = Story & {user: User}
export async function getFollowingStories(userId: string):Promise<StoriesWithUser[] | null> {
  if(!userId) return null;
  const followings = await prisma.follow.findMany({
    where: { followerId: userId },
    select: { followingId: true }, // 只取关注对象的ID
  });
  return await prisma.story.findMany({
    where: {
      expiresAt: {
        gt: new Date(),
      },
      userId: { in: followings.map((f) => f.followingId) },
    },
    include: { user: true },
  });


}