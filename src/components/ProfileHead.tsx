import Image from "next/image";
import React, { Suspense } from "react";

import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { isUserBlocked, UserWithCount } from "../../prisma/query/user";
import { formatNumber } from "@/utils";
import ProfileHeadBlock from "./ProfileHeadBlock";
import { Spinner } from "@heroui/react";


export default async function ProfileHead({ user }: { user: UserWithCount }) {
  if (!user) return notFound();

  //检查该查询用户是否block了该登录用户
  const { userId: currrentUserId } = await auth();
  let isBlocked;
  if (currrentUserId) {
    isBlocked = await isUserBlocked(currrentUserId, user.id);
  } else {
    isBlocked = false;
  }
  // if (isBlocked) return notFound();
  // if(isBlocked) return null;
  if (isBlocked) return (
    <Suspense fallback={<Spinner/>}>
      <ProfileHeadBlock />
    </Suspense>
  );

  return (
    <div className="flex flex-col items-center ">
      {/* Cover and Avatar */}
      <div className="h-64 w-full relative">
        <Image
          src={user.cover!}
          alt="Profile Image"
          fill
          className="object-cover rounded-md"
        />
        <Image
          src={user.avatar!}
          alt="Profile Avatar"
          width={112}
          height={112}
          className="absolute w-28 h-28 -bottom-14 left-1/2 -translate-x-1/2 rounded-full ring-2 ring-white z-10"
        />
      </div>

      {/* User Name */}
      <h1 className="text-2xl font-bold mt-15">
        {user?.name && user?.surname
          ? user.name + user.surname
          : user?.username}
      </h1>

      {/* UserInfo */}
      <div className="flex gap-12 mt-5 items-center">
        <div className="flex flex-col items-center">
          <span className="font-medium">{user._count.posts}</span>
          <span className="text-sm">Posts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">
            {formatNumber(user._count.following)}
          </span>
          <span className="text-sm">Followers</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="font-medium">
            {formatNumber(user._count.followers)}
          </span>
          <span className="text-sm">Following</span>
        </div>
      </div>
    </div>
  );
}
