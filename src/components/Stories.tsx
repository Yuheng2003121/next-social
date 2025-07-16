import { auth } from "@clerk/nextjs/server";
import { getFollowingStories } from "../../prisma/query/story";
import StoriesList from "./StoriesList";
import { getUserByIdPlain } from "../../prisma/query/user";

export default async function Stories() {
  const { userId } = await auth();
  const user = await getUserByIdPlain(userId!) //目前登录用户的信息
  if(!user) return null
  const stories = await getFollowingStories(userId!);
  if(!stories) return null
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-xs">
      {/* 外层容器：限制宽度 + 隐藏滚动条（视觉上对称） */}
      <div className="overflow-x-auto scrollbar-hide">
        {/* 内层 Flex 容器：实际内容 */}
        {/* <div className="flex gap-8">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 flex-shrink-0 cursor-pointer items-center"
            >
              <Image
                src="https://images.pexels.com/photos/32356082/pexels-photo-32356082.jpeg"
                alt="avatar"
                width={80}
                height={80}
                className="w-20 h-20 rounded-full ring-2 object-cover"
              />
              <span className="font-medium">Ricky</span>
            </div>
          ))}
        </div> */}
        <StoriesList stories={stories} user={user!}/>
      </div>
    </div>
  );
}
