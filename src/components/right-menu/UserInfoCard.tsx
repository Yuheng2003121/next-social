// import { Button } from "@heroui/react";
import { BriefcaseBusiness, GraduationCap, MapPin, LinkIcon, CalendarDays } from "lucide-react";
import Link from "next/link";
import React from "react";
import { isCurrentUserBlocked, isFollowRequestSent, isUserFollowing, UserWithCount } from "../../../prisma/query/user";
import { formatDate } from "@/utils";
import { auth } from "@clerk/nextjs/server";
import UserInfoCardInteraction from "./UserInfoCardInteraction";
import UpdateUser from "./UpdateUser";

export default async function UserInfoCard({user}: {user?: UserWithCount}) {
  if(!user) return null;

  // let isBloked = false;
  let isCurrentUserBloked;
  let isFollowing = false;
  let isRequestSent = false;

  const {userId: currentUserId} = await auth();
  if(currentUserId) {
    // isBloked = await isUserBlocked(currentUserId, user.id);
    isCurrentUserBloked = await isCurrentUserBlocked(currentUserId, user.id);
    
    isFollowing = await isUserFollowing(currentUserId, user.id);
    isRequestSent = await isFollowRequestSent(currentUserId, user.id);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* Top <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4 mt-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center font-md">
        <span className="text-gray-500">User Info</span>
        {currentUserId === user.id ? (
          <UpdateUser user={user}/>
        ) : (
          <Link href={"/"} className="text-blue-500 text-xs">
            See All
          </Link>
        )}
      </div>

      {/* name and email */}
      <div className="flex gap-3 items-center ">
        <h2 className="font-bold text-lg">
          {user?.name && user?.surname
            ? user.name + user.surname
            : user?.username}
        </h2>
        <span className="text-gray-500">@{user?.username}</span>
      </div>

      {/* descrition */}
      {user?.description && <p className="text-gray-500">{user.description}</p>}

      {/* social info */}
      <div className="flex flex-col gap-4 text-gray-500 text-sm">
        {user?.city && (
          <div className="flex gap-2 items-center">
            <MapPin size={16} />
            <span>
              Living in <span className="font-bold">{user.city}</span>
            </span>
          </div>
        )}
        {user?.school && (
          <div className="flex gap-2 items-center">
            <GraduationCap size={16} />
            <span>
              Went to <span className="font-bold">{user.school}</span>
            </span>
          </div>
        )}

        {user?.work && (
          <div className="flex gap-2 items-center">
            <BriefcaseBusiness size={16} />
            <span>
              Works at <span className="font-bold">{user.work}</span>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {user?.website && (
            <div className="flex gap-2 items-center">
              <LinkIcon size={16} />
              <Link href={"/"} className="text-blue-500 font-medium">
                lama.dey
              </Link>
            </div>
          )}
          <div className="flex gap-1 items-center">
            <CalendarDays size={16} />
            <span>Joined {formatDate(user.createdAt!)}</span>
          </div>
        </div>
      </div>

      {/*Button */}
      {/* <Button color="primary" radius="md" size="sm">
        Following
      </Button> */}

      {/* Block */}
      {/* <div className="flex justify-end">
        <span className="text-xs text-red-500 cursor-pointer">Block User</span>
      </div> */}

      {currentUserId && user.id !== currentUserId && (
        <UserInfoCardInteraction
          userId={user.id}
          currentUserId={currentUserId!}
          // isBloked={isBloked}
          isBloked={isCurrentUserBloked}
          isFollowing={isFollowing}
          isRequestSent={isRequestSent}
        />
      )}
    </div>
  );
}
