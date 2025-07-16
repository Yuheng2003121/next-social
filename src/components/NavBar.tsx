import Link from 'next/link'
import React from 'react'
import MobileMenu from './NavBar-MobileMenu'
import { Bell, CircleFadingPlus, House, LogIn, MessageCircleMore, UserRoundSearch, UsersRound } from 'lucide-react';
import { ClerkLoaded, ClerkLoading, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Spinner } from '@heroui/react';

export default function NavBar() {
  
  return (
    <div className="h-24 flex">
      <div className="flex md:hidden lg:flex w-[20%] items-center">
        <Link href="/" className="font-bold text-xl text-blue-600">
          LAMASOCIAL
        </Link>
      </div>

      <div className="hidden md:flex gap-6 text-gray-600  w-[50%]">
        <Link href="/login" className="flex gap-2 items-center">
          <House size={20} color="oklch(62.3% 0.214 259.815)" />
          <span>Homepage</span>
        </Link>
        <Link href="/login" className="flex gap-2 items-center">
          <UsersRound size={20} color="oklch(62.3% 0.214 259.815)" />
          <span>Friends</span>
        </Link>
        <Link href="/login" className="flex gap-2 items-center">
          <CircleFadingPlus size={20} color="oklch(62.3% 0.214 259.815)" />
          <span>Stories</span>
        </Link>
      </div>

      <div className="flex-1 flex gap-4 xl:gap-8 justify-end items-center ">
        <ClerkLoading>
          <Spinner />
        </ClerkLoading>

        <ClerkLoaded>
          <SignedIn>
            <div className="hidden md:flex items-center gap-4 -mr-2">
              <UserRoundSearch size={24} color="oklch(62.3% 0.214 259.815)" />
              <MessageCircleMore size={24} color="oklch(62.3% 0.214 259.815)" />
              <Bell size={24} color="oklch(62.3% 0.214 259.815)" />
            </div>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <div className="flex gap-2 items-center">
              <LogIn size={20} color="oklch(62.3% 0.214 259.815)" />
              <Link href="/sign-up">Login/Register</Link>
            </div>
          </SignedOut>
        </ClerkLoaded>
        <MobileMenu />
      </div>
    </div>
  );
}
