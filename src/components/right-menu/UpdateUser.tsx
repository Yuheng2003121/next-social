"use client";
import React, { useState } from "react";
import { UserWithCount } from "../../../prisma/query/user";
import { X } from "lucide-react";
import Image from "next/image";
import { Button, Form, Input, message } from "antd";
import { updateProfile } from "@/actions";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export interface UpdateFormData {
  name?: string;
  surName?: string;
  description?: string;
  work?: string;
  school?: string;
  city?: string;
  cover?: string;
}
export default function UpdateUser({ user }: { user?: UserWithCount }) {
  const [open, setOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cover, setCover] = useState<any>(null);

  // 阻止事件冒泡的函数
  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const [form] = Form.useForm();
  const variant = Form.useWatch("variant", form);
  const [isPending, setIsPending] = useState(false);

  async function submit(values: UpdateFormData) {
    setIsPending(true);
    const result = await updateProfile(values, cover);
    setIsPending(false);
    if (result.success && result.message) {
      message.success(result.message);
      form.resetFields();
    } else if (!result.success && result.errors && result.message) {
      message.error(result.message);
      console.log(result.errors);
      
    }
  }

  return (
    <div>
      <span
        className="text-blue-500 text-xs cursor-pointer"
        onClick={() => setOpen(true)}
      >
        Update
      </span>

      {open && (
        <div
          className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <Form
            {...formItemLayout}
            form={form}
            variant={variant || "filled"}
            style={{ maxWidth: 600 }}
            initialValues={{ variant: "filled" }}
            className="relative !p-12 bg-white rounded-lg shadow-md flex flex-col gap-2 w-full md:w-1/2 xl:w-1/3"
            onClick={stopPropagation}
            onFinish={submit}
          >
            <X
              className="absolute top-2 right-2 cursor-pointer"
              onClick={() => setOpen(false)}
            />
            <div className="flex flex-col gap-4">
              <h1>Update Profile</h1>
              <div className="text-xs text-gray-500">
                Use the navbar profile to change the avatar or username.
              </div>

              {/*Cloudnary pic upload */}
              <CldUploadWidget
                uploadPreset="social"
                onSuccess={(result) => {
                  setCover(
                    (result!.info! as CloudinaryUploadWidgetInfo).secure_url
                  );
                }}
              >
                {({ open }) => {
                  return (
                    // <button onClick={() => open()}>Upload an Image</button>
                    <div className="flex flex-col gap-4">
                      <label htmlFor="">Cover picture</label>
                      <div className="flex items-center gap-2">
                        <Image
                          src={user!.cover! || cover || "/NoCover.png"}
                          alt="Avatar"
                          width={48}
                          height={32}
                          className="w-12 h-8 rounded-md object-cover"
                        />
                        <span
                          className="text-xs underline text-gray-600 cursor-pointer"
                          onClick={() => open()}
                        >
                          Change
                        </span>
                      </div>
                    </div>
                  );
                }}
              </CldUploadWidget>
            </div>

            <Form.Item
              label="First Name"
              name="name"
              // rules={[
              //   { required: true, message: "Please input!" },
              //   {
              //     min: 2,
              //     message: "First name must be at least 2 characters long!",
              //   },
              // ]}
              className="text-start"
            >
              <Input placeholder={user!.name! || "John"} />
            </Form.Item>
            <Form.Item
              label="Surname"
              name="surName"
              // rules={[
              //   { required: true, message: "Please input!" },
              //   {
              //     min: 2,
              //     message: "Suranme name must be at least 2 characters long!",
              //   },
              // ]}
            >
              <Input placeholder={user!.surname! || "Doe"} />
            </Form.Item>
            <Form.Item
              label="Description"
              name="desc"
              // rules={[
              //   { required: true, message: "Please input!" },
              //   {
              //     min: 6,
              //     message: "Desc must be at least 2 characters long!",
              //   },
              // ]}
            >
              <Input placeholder={user!.description! || "Life is beautiful"} />
            </Form.Item>
            <Form.Item
              label="Work"
              name="work"
              // rules={[{ required: true, message: "Please input!" }]}
            >
              <Input placeholder={user!.work! || "Apple Inc."} />
            </Form.Item>
            <Form.Item
              label="School"
              name="school"
              // rules={[{ required: true, message: "Please input!" }]}
            >
              <Input placeholder={user!.school! || "MIT"} />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              // rules={[{ required: true, message: "Please input!" }]}
            >
              <Input placeholder={user!.city! || "New York"} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </div>
  );
}
