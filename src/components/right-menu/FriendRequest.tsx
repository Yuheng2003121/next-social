// export const dynamic = "force-dynamic";

import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { getFollowRequestsByUserId } from "../../../prisma/query/user";
// import FriendRequestItem from "./FriendRequestItem";
import FriendRequestList from "./FriendRequestList";

export default async function FriendRequest() {
  const { userId } = await auth();
  if (!userId) return null;
  const requests = await getFollowRequestsByUserId(userId);
  if (!requests) return null;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center font-md">
        <span className="text-gray-500">Friend Request</span>
        <Link href={"/"} className="text-blue-500 text-xs">
          See All
        </Link>
      </div>

      {/* Users List*/}
      {/* <div className="flex flex-col gap-4">
        {requests.map((request) => {
          return (
            <FriendRequestItem
              key={request.id}
              request={request}
              currentUserId={userId}
            />
          );
        })}
      </div> */}
      <FriendRequestList requests={requests} currentUserId={userId} />
    </div>
  );
}
