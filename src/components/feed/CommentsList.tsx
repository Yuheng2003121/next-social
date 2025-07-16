"use client";
import Image from "next/image";
import React, { useActionState, useEffect } from "react";
import { CommentsWithUser } from "../../../prisma/query/comment";
import { User } from "../../../generated/prisma";
import { commentAction } from "@/actions";
import { message } from "antd";

export default function CommentsList({
  comments,
  postId,
  user,
}: {
  comments: CommentsWithUser[];
  postId: number;
  user: User | null;
}) {
  const [commentState, comment] = useActionState(commentAction.bind(null, postId, user!.id), {
    success: false,
    message: "",
    error: ""
  });

  useEffect(() => {
    if (commentState.success && commentState.message) {
      message.success(commentState.message);
    } else if(!commentState.success && commentState.error && commentState.message) {
      message.error(commentState.message);
    }
  }, [commentState.success, commentState.message, commentState.error]);
  
  return (
    <div>
      {/* Comment Input */}
      {user && (
        <div className="flex gap-4 items-center">
          <Image
            src={user!.avatar || "/noAvatar.png"}
            alt="Avatar"
            width={32}
            height={32}
            className="w-8 h-8 object-cover rounded-full"
          />
          <form action={comment} className="flex-1 flex gap-2 items-center justify-between rounded-lg px-4 py-2 bg-slate-100">
            <input
              type="text"
              name="comment"
              placeholder="Write a comment"
              className="flex-1 bg-transparent outline-none "
            />
            <Image
              src="/emoji.png"
              alt="Comment"
              width={16}
              height={16}
              className="cursor-pointer"
            />
          </form>
        </div>
      )}

      {/* Comments */}
      <div>
        {comments.map((comment) => (
          <div className="flex gap-4 mt-6 border-b-1 border-gray-200" key={comment.id}>
            {/* Avatar */}
            <div>
              <Image
                src={comment.user.avatar || "/noAvatar.png"}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>

            {/* Desc */}
            <div className="flex-1 flex flex-col gap-2">
              <span className="font-medium">
                {comment.user.name && comment.user.surname
                  ? comment.user.name + "" + comment.user.surname
                  : comment.user.username}
              </span>
              <p>{comment.desc}</p>
              <div className="flex items-center gap-6 text-sm mb-2">
                <div className="flex items-center gap-3 rounded-lg p-1">
                  <Image
                    src="/like.png"
                    alt="like"
                    width={16}
                    height={16}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-300">|</span>
                  <span className="text-gray-500">
                    123 <span className="hidden md:inline"> Likes</span>
                  </span>
                </div>
                <span className="text-gray-500">Reply</span>
              </div>
            </div>

            {/* More Icon */}
            <Image
              src={"/more.png"}
              alt="More"
              width={16}
              height={16}
              className="cursor-pointer w-4 h-4"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
