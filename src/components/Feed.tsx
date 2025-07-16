import React from "react";
import Post from "./feed/Post";
import { auth } from "@clerk/nextjs/server";
import {
  getFollowingPostsByUserId,
  getPostsByUsername,
} from "../../prisma/query/post";

export default async function Feed({ username }: { username?: string }) {
  const { userId } = await auth();
  let posts = null;
  if (username) {
    //如果这是在查看指定username的post
    posts = await getPostsByUsername(username);
  }

  if (!username && userId) {
    //如果这是在首页, 获取所有目前登录userId 所follow所有用户的post
    posts = await getFollowingPostsByUserId(userId);
  }
  return (
    <div className="p-4 border-lg shadow-md bg-white flex flex-col gap-12">
      {!!posts?.length
        ? posts.map((post) => <Post key={post.id} post={post} />)
        : "No posts found"}
    </div>
  );
}
