import Feed from "@/components/Feed";
import LeftMenu from "@/components/left-menu/LeftMenu";
import RightMenu from "@/components/right-menu/RightMenu";
import ProfileHead from "@/components/ProfileHead";
import React from "react";
import { getUserByUsername } from "../../../../prisma/query/user";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username); //查询用户的信息

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="profile" />
      </div>

      <div className="w-full lg:w-[70%] xl:w-[50%]">
        <div className="flex flex-col gap-6">
          <ProfileHead user={user} />
          <Feed username={username}/>
        </div>
      </div>

      <div className="hidden lg:block w-[30%]">
        <RightMenu user={user} />
      </div>
    </div>
  );
}
