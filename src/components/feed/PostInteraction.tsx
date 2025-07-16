"use client";
import Image from "next/image";
import React, { useState } from "react";
import { PostWithCount } from "../../../prisma/query/post";
import { switchLikeAction } from "@/actions";
import { message } from "antd";
import { Spinner } from "@heroui/react";

export default function PostInteraction({ post, userId }: { post: PostWithCount, userId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  if (!userId) return null;
  const likes = post.likes.map((like) => like.userId); //所有这个post的所有likes的userId
  const isLiked = likes.includes(userId!);

  async function switchLike() {
    setIsLoading(true);
    const res = await switchLikeAction(userId!, post.id, {
      success: false,
      error: "",
      message: "",
    });
    setIsLoading(false);
    if (res.success && res.message) {
      message.success(res.message);
    } else if (!res.success && res.message && res.error) {
      message.error(res.error);
    }
  }

  return (
    <div className="flex items-center justify-between text-sm my-4">
      <div className="flex gap-8 ">
        <div className="flex gap-3 rounded-lg bg-slate-100 p-2 items-center">
          {isLoading ? (
            <Spinner size="sm"></Spinner>
          ) : (
            <Image
              src={isLiked ? "/liked.png" : "/like.png"}
              alt="like"
              width={16}
              height={16}
              className="w-4 h-4 cursor-pointer"
              onClick={switchLike}
            />
          )}
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {post._count.likes}
            <span className="hidden md:inline"> Likes</span>
          </span>
        </div>

        <div className="flex gap-3 rounded-lg bg-slate-100 p-2 items-center">
          <Image src="/comment.png" alt="like" width={16} height={16} />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            {post._count.comments}
            <span className="hidden md:inline"> Comments</span>
          </span>
        </div>
      </div>

      <div>
        <div className="flex gap-3 rounded-lg bg-slate-100 p-2 items-center">
          <Image src="/share.png" alt="like" width={16} height={16} />
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">
            <span className="hidden md:inline"> Shares</span>
          </span>
        </div>
      </div>
    </div>
  );
}
