"use server";

import { UpdateFormData } from "@/components/right-menu/UpdateUser";
import prisma from "@/db/client";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import z from "zod";

export interface PrevState {
  success: boolean;
  message?: string;
  error?: string;
}

export async function addPost(
  img: string | null,
  prevState: PrevState,
  formData: FormData
): Promise<PrevState> {

  let result;
  const desc = formData.get("desc")?.toString() ?? "";
  const { userId } = await auth();

  if (!userId) {
    result = {
      ...prevState,
      success: false,
      error: "User not authenticated",
    };
    return result;
  }
  const schema = z.object({
    desc: z.string().min(1).max(500),
  });

  const validateData = schema.safeParse({ desc });
  if(!validateData.success) {
    result = {
      ...prevState,
      success: false,
      message: "Invalid description",
      error: validateData.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.post.create({
      data: {
        desc: validateData.data!.desc,
        userId,
        img: img ? img : null,
      },
    });

    result = {
      ...prevState,
      success: true,
      message: "Post created successfully!",
    };
  } catch (error) {
    console.error("Error creating post:", error);
    result = {
      ...prevState,
      success: false,
      error: error instanceof Error ? error.message : "Failed to create post",
    };
  }

  revalidatePath("/");
  return result;
}


export async function switchFollow(
  userId: string,
  currentUserId: string,
  prevState: PrevState,
): Promise<PrevState> {
  // await sleep(3000);

  let result;
  if (!currentUserId) {
    result = {
      ...prevState,
      success: false,
      error: "User not authenticated",
    };
  }
  
  try {
    const follow = await prisma.follow.findFirst({
      where: {
        followerId: currentUserId,
        followingId: userId,
      },
    });

    if (follow) {
      //unfollow
      await prisma.follow.delete({
        where: {
          id: follow.id,
        },
      });
      result = {
        ...prevState,
        success: true,
        message: "Unfollowed successfully!",
      };
    } else {
      //sendRequest -> follow
      const followRequest = await prisma.followRequest.findFirst({
        where: {
          senderId: currentUserId,
          receiverId: userId,
        },
      });

      if (followRequest) {
        //reRequest alrayed sent -> delete this request
        await prisma.followRequest.delete({
          where: {
            id: followRequest.id,
          },
        });
        result = {
          ...prevState,
          success: true,
          message: "Follow request has deleted successfully!",
        };
      } else {
        //send follow request
        await prisma.followRequest.create({
          data: {
            senderId: currentUserId,
            receiverId: userId,
          },
        });
        result = {
          ...prevState,
          success: true,
          message: "Follow request sent successfully!",
        };
      }
    }
  } catch (error) {
    console.log(error);
    result = {
      ...prevState,
      success: false,
      error: error instanceof Error ? error.message : "Failed to follow",
    };
  }

  revalidatePath("/profile/");
  return result;
}



export async function switchBlock(userId: string, currentUserId: string, prevState: PrevState) {
  
  if (!currentUserId) {
    throw new Error("User not authenticated");
  }

  let result;
  try {
    const block = await prisma.block.findFirst({
      where: {
        blockerId: currentUserId,
        blockedId: userId,
      },
    });

    if (block) {
      await prisma.block.delete({
        where: {
          id: block.id,
        },
      });
      result = {
        ...prevState,
        success: true,
        message: "Unblocked the user successfully!",
      };
    } else {
      await prisma.block.create({
        data: {
          blockerId: currentUserId,
          blockedId: userId,
        },
      });
      result = {
        ...prevState,
        success: true,
        message: "Blocked the user successfully!",
      };
    }

  } catch(error) {
    console.log(error);
    result = {
      ...prevState,
      success: false,
      error: error instanceof Error ? error.message : "Failed to the user block",
    };
  }

  revalidatePath("/profile/");
  return result;
}


// export async function acceptFollowRequest(userId: string, currentUserId: string, prevState: PrevState): Promise<PrevState> {
//   let result;

//   if(!currentUserId) {
//     return result = {
//       ...prevState,
//       success: false,
//       error: "User not authenticated",
//     };
//   }

//   try {
//     const request = await prisma.followRequest.findFirst({
//       where: {
//         senderId: userId,
//         receiverId: currentUserId,
//       },
//     });

//     if (request) {
//       await prisma.followRequest.delete({
//         where: {
//           id: request.id,
//         },
//       });

//       await prisma.follow.create({
//         data: {
//           followerId: userId,
//           followingId: currentUserId,
//         },
//       });

//       result = {
//         ...prevState,
//         success: true,
//         message: "Follow request accepted successfully!",
//       };
//     } else {
//       result = {
//         ...prevState,
//         success: false,
//         error: "Follow request not found",
//       };
//     }

//   } catch (error) {
//     result = {
//       ...prevState,
//       success: false,
//       error: error instanceof Error ? error.message : "Failed to accept follow request",
//     };

//   }
  
//   revalidatePath("/profile/");
//   return result;
// }

export async function acceptFollowRequest(
  prevState: PrevState,
  formData: FormData,
) {
  let result;
  const userId = formData.get("userId") as string;
  const currentUserId = formData.get("currentUserId") as string;
  if (!currentUserId) {
    return (result = {
      ...prevState,
      success: false,
      error: "User not authenticated",
    });
  }

  try {
    const request = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (request) {
      await prisma.followRequest.delete({
        where: {
          id: request.id,
        },
      });

      await prisma.follow.create({
        data: {
          followerId: userId,
          followingId: currentUserId,
        },
      });

      result = {
        ...prevState,
        success: true,
        message: "Follow request accepted successfully!",
      };
    } else {
      result = {
        ...prevState,
        success: false,
        error: "Follow request not found",
      };
    }
  } catch (error) {
    result = {
      ...prevState,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to accept follow request",
    };
  }
  
  revalidatePath("/");
  return result;
}


export async function declineFollowRequest(
  prevState: PrevState,
  formData: FormData,
): Promise<PrevState> {
  let result;
  const userId = formData.get("userId") as string;
  const currentUserId = formData.get("currentUserId") as string;

  if (!currentUserId) {
    return (result = {
      ...prevState,
      success: false,
      error: "User not authenticated",
    });
  }

  try {
    const request = await prisma.followRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: currentUserId,
      },
    });

    if (request) {
      await prisma.followRequest.delete({
        where: {
          id: request.id,
        },
      });

      result = {
        ...prevState,
        success: true,
        message: "Follow request declined successfully!",
      };
    } else {
      result = {
        ...prevState,
        success: false,
        error: "Follow request not found",
      };
    }

  } catch (error) {
    result = {
      ...prevState,
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to decline follow request",
    };
  }

  revalidatePath("/");
  return result;
}


//zod验证
const updateProfileSchema = z.object({
  firstName: z.string().max(20, "First name is too long").optional(),
  name: z.string().max(20, "Surname is too long").optional(),
  desc: z.string().max(255, "Description is too long").optional(),
  city: z.string().optional(),
  work: z.string().optional(),
  school: z.string().optional(),
  cover: z.string().optional()
});
//antd的表单验证, 这里formData是对象
export async function updateProfile(formData: UpdateFormData, cover: string) {
  let result;
  if(!cover) cover = ""
  formData = {...formData, cover}
  const nonEmptyFields = Object.fromEntries(
    Object.entries(formData).filter(([, value]) => value !== "")
  );

  if(Object.keys(nonEmptyFields).length === 0) {
    return {
      success: false,
      error: "Empty fields",
      message: "No fields were provided",
    };
  };

  const validData = updateProfileSchema.safeParse({cover, ...nonEmptyFields });
  if (!validData.success) {

    const fieldErrors = validData.error.flatten().fieldErrors;
    return result =  {
      success: false,
      errors: fieldErrors,
      message: "Validation failed",
    };
  }

  //验证成功后, 操作数据库
  try {
    const {userId} = await auth();

    if (!userId) {
      throw new Error("User not Authenticated");
    }

    await prisma.user.update({
      where: { id: userId },
      data: validData.data
    });

    result = {
      message: "Profile updated successfully",
      success: true
    }

  } catch (error) {
    result = {
      success: false,
      message: "Failed to update the message",
      error:
        error instanceof Error
          ? error.message
          : "Failed to update the message",
    };
  }

  revalidatePath("/");
  return result;
}

export async function switchLikeAction(userId: string, postId: number ,prevState: PrevState) {
  let result;
  if(!userId) {
    result = {
      ...prevState,
      success: false,
      error: "User not authenticated",
    }
  }

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        postId
      }
    })
    if(existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id
        }
      })
      result = {
        ...prevState,
        success: true,
        message: "Unliked successfully"
      }
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId
        }
      })
      result = {
        ...prevState,
        success: true,
        message: "Liked successfully"
      }
    }
  } catch (error) {
    result = {
      ...prevState,
      success: false,
      error: error instanceof Error ? error.message : "Failed to like",
    }
  }

  revalidatePath("/");
  return result;
}

export async function commentAction(postId: number, userId: string,prevState: PrevState ,formData: FormData): Promise<PrevState> {
  let result;
  if(!userId) {
    result = {
      ...prevState,
      success: false,
      error: "User not authenticated",
    }
  }

  const comment = formData.get("comment") as string;
  try {
    await prisma.comment.create({
      data: {
        postId,
        userId,
        desc: comment
      }
    })
    result = {
      ...prevState,
      success: true,
      message: "Commented successfully"
    }
  } catch (error) {
    result = {
      ...prevState,
      success: false,
      error: error instanceof Error ? error.message : "Failed to comment",
    }
  }
  
  revalidatePath("/");
  return result;
}


export async function addStoryAction(
  img: string,
  userId: string,
  prevState: PrevState,
) {
  let result;
  if (!userId) {
    result = {
      ...prevState,
      success: false,
      error: "Please login first",
    };
  }

  if (!img) {
    result = {
      ...prevState,
      success: false,
      error: "Please select an image",
    };
  }

  try {
    //一个用户只能有一个story, 如何存在则删除
    const existinStory = await prisma.story.findFirst({
      where: {
        userId,
      },
    });
    if (existinStory) {
      await prisma.story.delete({
        where: {
          id: existinStory.id,
        },
      });
    }
    await prisma.story.create({
      data: {
        userId,
        img: img,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: { user: true },
    });
    result = {
      ...prevState,
      success: true,
      message: "Story added successfully",
    };
  } catch (error) {
    result = {
      ...prevState,
      success: false,
      error: error instanceof Error ? error.message : "Something went wrong",
    };
  }

  revalidatePath("/");
  return result;
}