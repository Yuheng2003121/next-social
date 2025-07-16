import Image from "next/image";
import React from "react";
import { getUserById } from "../../../prisma/query/user";
import { auth } from "@clerk/nextjs/server";
import { formatNumber } from "@/utils";

export default async function ProfileCard() {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await getUserById(userId);

  return (
    <div className="p-4 border-lg shadow-md bg-white text-sm flex flex-col gap-5">
      {/* Cover and Avatar */}
      <div className="h-20 relative">
        <Image
          src={user?.cover as string || '/noCover.png'}
          fill
          alt="Cover"
          className="object-cover rounded-md"
        />
        <Image
          src={user?.avatar as string || '/noAvatar.png'}
          width={44}
          height={44}
          alt="Avatar"
          className="object-cover rounded-full absolute w-12 h-12 ring-1 ring-white -bottom-6 left-1/2 -translate-x-1/2"
        />
      </div>

      {/* Name */}
      <h1 className="self-center text-md font-bold mt-2">
        {user?.name && user?.surname
          ? user.name + user.surname
          : user?.username}
      </h1>

      {/* followers */}
      <p className="self-center text-sm text-gray-500">
        {formatNumber(user?._count.following as number)} followers
      </p>
          
      {/* Button */}
      <button className="self-center px-2 py-2 bg-blue-500 rounded-md text-white text-xs">
        My Profiles
      </button>
    </div>
  );
}
