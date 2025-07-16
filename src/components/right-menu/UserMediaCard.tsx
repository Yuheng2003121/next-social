import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserWithCount } from "../../../prisma/query/user";
import { getPostByUserId } from "../../../prisma/query/post";

export default async function UserMediaCard({
  user,
}: {
  user?: UserWithCount;
}) {
  const postsWithMedia = await getPostByUserId(user?.id as string);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4 mt-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center font-md">
        <span className="text-gray-500">User Media</span>
        <Link href={"/"} className="text-blue-500 text-xs">
          See All
        </Link>
      </div>

      {/* Photos list */}
      <div className="flex gap-4 flex-wrap justify-between">
        {!!postsWithMedia.length ? (
          postsWithMedia.map((post) => (
            <div className="relative w-[calc(25%-12px)] h-24" key={post.id}>
              <Image
                src={post.img!}
                alt="Media"
                fill
                className="object-cover rounded-md"
              />
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No Media found</div>
        )}
      </div>
    </div>
  );
}
