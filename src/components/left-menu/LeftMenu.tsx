import React from "react";
import ProfileCard from "./ProfileCard";
import Link from "next/link";
import Image from "next/image";
import Ad from "../right-menu/Ad";

const menuItems = [
  { url: "/", name: "My Posts", picUrl: "/posts.png" },
  { url: "/", name: "Activity", picUrl: "/activity.png" },
  { url: "/", name: "Marketplace", picUrl: "/market.png" },
  { url: "/", name: "Events", picUrl: "/events.png" },
  { url: "/", name: "Albums", picUrl: "/albums.png" },
  { url: "/", name: "Videos", picUrl: "/videos.png" },
  { url: "/", name: "News", picUrl: "/news.png" },
  { url: "/", name: "Courses", picUrl: "/courses.png" },
  { url: "/", name: "Lists", picUrl: "/lists.png" },
  { url: "/", name: "Settings", picUrl: "/settings.png" },
];
export default function LeftMenu({ type }: { type: "home" | "profile" }) {
  return (
    <div className="flex flex-col gap-6">
      {type === "home" && <ProfileCard />}

      {/* Menus */}
      <div className="p-4 border-lg shadow-md bg-white text-sm text-gray-500 flex flex-col gap-6">
        {menuItems.map((item) => (
          <Link
            href={`${item.url}`}
            key={item.name}
            className="flex gap-3 items-center"
          >
            <Image
              src={`${item.picUrl}`}
              alt={item.name}
              width={20}
              height={20}
            />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      {/* Ad */}
      <Ad size="small" />
    </div>
  );
}
