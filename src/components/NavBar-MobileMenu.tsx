"use client";

import { AlignJustify, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <div className="relative w-7 h-7 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <AlignJustify
          size={28}
          color="oklch(62.3% 0.214 259.815)"
          strokeWidth={2.75}
          className={`absolute transition-opacity duration-200 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <X
          size={28}
          color="oklch(62.3% 0.214 259.815)"
          strokeWidth={2.75}
          className={`absolute transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 left-0 top-24 w-full h-[calc(100vh-6rem)] bg-white flex flex-col gap-8 items-center justify-center font-medium text-xl">
          <Link href="/">Home</Link>
          <Link href="/">Friends</Link>
          <Link href="/">Groups</Link>
          <Link href="/">Stories</Link>
        </div>
      )}
    </div>
  );
}
