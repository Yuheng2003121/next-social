"use client";
import { addPost } from "@/actions";
import { Button } from "@heroui/react";
import { message } from "antd";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import React, { useActionState, useEffect, useState } from "react";

const PostOptions = [
  { url: "/addimage.png", text: "Photo" },
  { url: "/addevent.png", text: "Event" },
  { url: "/addvideo.png", text: "Video" },
  { url: "/poll.png", text: "Poll" },
];
export default function AddPost() {
  const [img, setImg] = useState<string | null>(null);
  const [postState, post, isPending] = useActionState(addPost.bind(null, img), {
    success: false,
    message: "",
    error: "",
  });
  useEffect(() => {
    if (postState.success && postState.message) {
      message.success(postState.message);
    } else if (postState.error && postState.message) {
      message.error(postState.message);
    }
  }, [postState.success, postState.message, postState.error]);
  return (
    <div className="p-4 border-lg shadow-md bg-white rounded-lg flex gap-4 justify-between text-sm">
      {/* Avatar */}
      <Image
        src="https://images.pexels.com/photos/32356082/pexels-photo-32356082.jpeg"
        width={48}
        height={48}
        alt="Avatar"
        className="w-12 h-12 rounded-full object-cover"
      ></Image>

      {/* Post */}
      <div className="flex-1">
        {/* Text */}
        <form action={post} className="flex gap-2">
          <textarea
            name="desc"
            id=""
            placeholder="What is on your mind?"
            className="flex-1 rounded-lg bg-slate-100 outline-none p-2"
            rows={3}
          ></textarea>
          <Image
            src="/emoji.png"
            width={20}
            height={20}
            alt="Avatar"
            className="w-5 h-5 rounded-full object-cover self-end"
          ></Image>
          <Button disabled={isPending} type="submit" size="sm" color="primary">
            {isPending ? "Posting..." : "Post"}
          </Button>
        </form>
        {/* Options */}
        <div className="flex gap-5 mt-4 text-gray-400 flex-wrap">
          {PostOptions.map((item, index) => (
            // <div key={index} className="flex gap-2 items-center cursor-pointer">
            //   <Image
            //     src={item.url}
            //     width={20}
            //     height={20}
            //     alt="Option"
            //     className="w-5 h-5 object-cover"
            //   ></Image>
            //   <span className="text-xs">{item.text}</span>
            // </div>
            <CldUploadWidget
              key={index}
              uploadPreset="social"
              onSuccess={(result) => {
                setImg(
                  (result!.info! as CloudinaryUploadWidgetInfo).secure_url
                );
              }}
            >
              {({ open }) => {
                return (
                  <div
                    className="flex gap-2 items-center cursor-pointer"
                  >
                    <Image
                      src={item.url}
                      width={20}
                      height={20}
                      alt="Option"
                      className="w-5 h-5 object-cover"
                      onClick={() => open()}
                    ></Image>
                    <span className="text-xs">{item.text}</span>
                  </div>
                );
              }}
            </CldUploadWidget>
          ))}
        </div>
      </div>
    </div>
  );
}
