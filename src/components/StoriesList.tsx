"use client";
import React, { useActionState, useEffect, useState } from "react";
import { StoriesWithUser } from "../../prisma/query/story";
import Image from "next/image";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { addStoryAction } from "@/actions";
import { User } from "../../generated/prisma";
import { message } from "antd";

export default function StoriesList({
  stories,
  user,
}: {
  stories: StoriesWithUser[];
  user: User;
}) {
  

  const [img, setImg] = useState<string | null>(null);
  const [storyState, addStory, isPending] = useActionState(addStoryAction.bind(null, img!, user.id), {
    success: false,
    message: "",
    error: "",
  })

  useEffect(() => {
    if(storyState.success && storyState.message) {
      message.success(storyState.message);
      setImg(null);
    } else if (!storyState.success && storyState.error) {
      message.error(storyState.error);
    }
  }, [storyState])

  return (
    <div className="flex gap-8">
      {/* 添加 */}
      <CldUploadWidget
        uploadPreset="social"
        onSuccess={(result) => {
          setImg((result!.info! as CloudinaryUploadWidgetInfo).secure_url);
        }}
      >
        {({ open }) => {
          return (
            <div className="flex flex-col gap-2 flex-shrink-0 cursor-pointer items-center ">
              <div onClick={() => open()} className="relative">
                <div className="absolute text-6xl text-gray-200 left-1/2 -translate-x-1/2 top-1">+</div>
                <Image
                  src={img || user.avatar || "/noAvatar.png"}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full ring-2 object-cover"
                />
              </div>

              {img ? (
                <form action={addStory}>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm cursor-pointer">
                    {isPending ? "Adding" : "Add"}
                  </button>
                </form>
              ) : (
                <span className="font-medium">Add a story</span>
              )}
            </div>
          );
        }}
      </CldUploadWidget>
      {/* story list */}
      {stories.map((story) => (
        <div
          key={story.id}
          className="flex flex-col gap-2 flex-shrink-0 cursor-pointer items-center"
        >
          <Image
            src={story.user.avatar || "/noAvatar.png"}
            alt="avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full ring-2 object-cover"
          />
          <span className="font-medium">
            {story.user.name || story.user.username}
          </span>
        </div>
      ))}
    </div>
  );
}
