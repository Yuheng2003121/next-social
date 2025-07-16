  "use client";
  import { switchBlock, switchFollow } from "@/actions";
  import { Button, Spinner } from "@heroui/react";
  import { message } from "antd";
  import React, { useActionState, useEffect } from "react";

  interface Props {
    userId: string;
    currentUserId: string;
    isBloked?: boolean;
    isFollowing: boolean;
    isRequestSent: boolean;
  }
  export default function UserInfoCardInteraction(props: Props) {
    const { userId, currentUserId, isBloked, isFollowing, isRequestSent } = props;

    // 使用单个 message 实例
    const [messageApi, contextHolder] = message.useMessage();

    // 关注按钮的 server action
    const [followState, follow, isPendingFollow] = useActionState(
      switchFollow.bind(null, userId, currentUserId),
      { success: false, message: "", error: "" }
    );

    // Block 按钮的 server action
    const [blockState, block, isPendingBlock] = useActionState(
      switchBlock.bind(null, userId, currentUserId),
      { success: false, message: "", error: "" }
    );
    

    // 统一处理server action返回消息提示
    useEffect(() => {
      if (followState.success && followState.message) {
        messageApi.success(followState.message);
      } else if (followState.error) {
        messageApi.error(followState.error);
      }
    }, [followState.message, followState.success, followState.error, messageApi]);

    useEffect(() => {
      if (blockState.success && blockState.message) {
        messageApi.success(blockState.message);
      } else if (blockState.error) {
        messageApi.error(blockState.error);
      }
    }, [blockState.message, blockState.success, blockState.error, messageApi]);

    return (
      <div className="flex flex-col gap-3">
        {contextHolder}
        <form action={follow} className="flex">
          <Button
            color="primary"
            type="submit"
            radius="md"
            size="sm"
            className="w-full"
          >
            {isPendingFollow ? (
              <Spinner size="sm" color="default" />
            ) : isFollowing ? (
              "Following"
            ) : isRequestSent ? (
              "Request Sent"
            ) : (
              "Follow"
            )}
          </Button>
        </form>

        {/* Block */}
        <form action={block} className="flex justify-end">
          <button type="submit" className="text-xs text-red-500 cursor-pointer">
            {isPendingBlock ? (
              <Spinner size="sm" color="primary" />
            ) : isBloked ? (
              "Unblock"
            ) : (
              "Block"
            )}
          </button>
        </form>
      </div>
    );
  }
