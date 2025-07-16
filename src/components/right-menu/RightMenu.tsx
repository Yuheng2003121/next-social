import React, { Suspense } from "react";
import FriendRequest from "./FriendRequest";
import Birthday from "./Birthday";
import Ad from "./Ad";
import UserInfoCard from "./UserInfoCard";
import UserMediaCard from "./UserMediaCard";
import { UserWithCount } from "../../../prisma/query/user";
import { Spinner } from "@heroui/react";

export default function RightMenu({ user }: { user?: UserWithCount }) {
  return (
    <div className="flex flex-col gap-6">
      {user && (
        <div>
          <Suspense fallback={<Spinner size="sm" />}>
            <UserInfoCard user={user} />
          </Suspense>

          <Suspense fallback={<Spinner size="sm" />}>
            <UserMediaCard user={user} />
          </Suspense>
        </div>
      )}
      {/* Friend Requests */}
      <FriendRequest />

      {/* Birthday */}
      <Birthday />

      {/* Ads */}
      <Ad size="medium" />
    </div>
  );
}
