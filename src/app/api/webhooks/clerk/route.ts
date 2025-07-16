import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { addUser, updateUser } from "../../../../../prisma/query/user";
// 一旦有用户被创建/更新, 这里就会收到通知, 然后操作数据库添加/更新用户
export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const { id } = evt.data;
    const eventType = evt.type;
    
    if(eventType === "user.created" ) {
      const { id, username, image_url } = evt.data;
      try {
        //把用户添加到数据库中
        // await prisma.user.create({
        //   data: {
        //     id: evt.data.id,
        //     username: evt.data.username!,
        //     avatar: evt.data.image_url || "/noAvatar.png",
        //     cover: "/noCover.png",
        //   },
        // });
        await addUser({ id, username, image_url });

        return new Response("User has been created", { status: 200 });
      } catch (error) {
        console.log(error);
        return new Response("Failed to create User", { status: 400 });
        
      }
    }

    if(eventType === "user.updated") {
      // 更新该用户id的数据库
      const { id, username, image_url } = evt.data;
      await updateUser({ id, username, image_url });
      return new Response("User has been updated", { status: 200 });
    }

    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log("Webhook payload:", evt.data);

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
