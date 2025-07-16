import { Button } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Ad({ size }: { size: "small" | "medium" | "large" }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-3">
      {/* header */}
      <div className="flex justify-between items-center">
        <span>Sponsored Ads</span>
        <Image
          src={"/more.png"}
          alt="More"
          width={16}
          height={16}
          className="w-4 h-4"
        />
      </div>

      {/* Image */}
      <div className={`relative w-full ${size === 'small'? "h-24" : size === 'medium'? "h-32" : "h-48" }`}>
        <Image
          src={
            "https://images.pexels.com/photos/20358174/pexels-photo-20358174.jpeg"
          }
          alt="Body Image"
          fill
          className="object-cover rounded-md"
        />
      </div>

      {/* User */}
      <Link
        href={"/"}
        className={`flex items-center ${size === "small" ? "gap-3" : "gap-4"}`}
      >
        <Image
          src={
            "https://images.pexels.com/photos/31701360/pexels-photo-31701360.jpeg"
          }
          alt="Avatar"
          width={28}
          height={28}
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="font-md text-blue-500">Rodney Harris</span>
      </Link>

      {/* Desc */}
      <p className="text-sm">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat
        exercitationem vero voluptatem quia ipsam molestias voluptates non
        facilis vitae laudantium incidunt minima suscipit nobis impedit, nostrum
        perspiciatis dolores tempora tempore.
      </p>

      {/* Button */}
      {/* <div className="flex items-center py-2 rounded-lg bg-slate-200">
        Learn More
      </div> */}
      <Button size="sm" className="text-gray-500" radius="md">
        Learn More
      </Button>
    </div>
  );
}
