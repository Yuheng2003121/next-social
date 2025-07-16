"use client";
import Image from "next/image";
import React, { useActionState, useEffect } from "react";
import { RequestWithUser } from "../../../prisma/query/user";
import {
  acceptFollowRequest,
  declineFollowRequest,
  PrevState,
} from "@/actions";
import { message } from "antd";

export default function FriendRequestList({
  requests,
  currentUserId,
}: {
  requests: RequestWithUser;
  currentUserId: string;
}) {
  // const router = useRouter();
  const [acceptState, acceptAction] = useActionState(
    async (prevState: PrevState, formData: FormData) => {
      const result = await acceptFollowRequest(prevState, formData);
      return result;
    },
    {
      success: false,
      message: "",
      error: "",
    }
  );

  const [declineState, declineAction] = useActionState(declineFollowRequest, {
    success: false,
    message: "",
    error: "",
  });
  console.log(acceptState);

  // 统一处理server action返回消息提示
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (acceptState.success && acceptState.message) {
      messageApi.success(acceptState.message);
    } else if (acceptState.error) {
      messageApi.error(acceptState.error);
    }
  }, [acceptState.success, acceptState.message, acceptState.error, messageApi]);

  useEffect(() => {
    if (declineState.success && declineState.message) {
      messageApi.success(declineState.message);
    } else if (declineState.error) {
      messageApi.error(declineState.error);
    }
  }, [
    declineState.success,
    declineState.message,
    declineState.error,
    messageApi,
  ]);

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}

      {requests.map((request) => {
        const { sender: user } = request;
        const avatarUrl = user.avatar || "/default-avatar.png";
        return (
          <div className="flex items-center justify-between" key={request.id}>
            <div className="flex items-center gap-3">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-md font-bold flex-1">
                {user?.name && user?.surname
                  ? user.name + user.surname
                  : user?.username}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <form action={acceptAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input
                  type="hidden"
                  name="currentUserId"
                  value={currentUserId}
                />
                <button type="submit">
                  <Image
                    src={"/accept.png"}
                    alt="Accept"
                    width={20}
                    height={20}
                    className="w-5 h-5 cursor-pointer"
                  />
                </button>
              </form>

              <form action={declineAction}>
                <input type="hidden" name="userId" value={user.id} />
                <input
                  type="hidden"
                  name="currentUserId"
                  value={currentUserId}
                />
                <button type="submit">
                  <Image
                    src={"/reject.png"}
                    alt="Accept"
                    width={20}
                    height={20}
                    className="w-5 h-5 cursor-pointer"
                  />
                </button>
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
}
