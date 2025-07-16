import Image from "next/image";
import React from "react";
import Comments from "./Comments";
import { type PostWithCount } from "../../../prisma/query/post";
import PostInteraction from "./PostInteraction";
import { auth } from "@clerk/nextjs/server";

export default async function Post({ post }: { post: PostWithCount }) {
  if (!post) return null;
  const {userId} = await auth()
  return (
    <div className="flex flex-col gap-4">
      {/* User bar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Image
            src={post.user.avatar! || "/noAvatar.png"}
            alt="Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="font-medium">
            {post.user.name && post.user.surname
              ? post.user.name + "" + post.user.surname
              : post.user.username}
          </span>
        </div>
        <Image
          src="/more.png"
          alt="more button"
          width={16}
          height={16}
          className="w-4 h-4 rounded-full object-cover"
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-4">
        {post.img && (
          <div className="min-h-96 relative">
            <Image
              src={post.img}
              alt="Post"
              fill
              className=" object-cover rounded-md"
            />
          </div>
        )}
        <p>{post.desc}</p>
      </div>

      {/* Interaction */}
      <PostInteraction post={post} userId={userId!} />

      {/* Comments */}
      <Comments post={post} userId={userId!} />
    </div>
  );
}
