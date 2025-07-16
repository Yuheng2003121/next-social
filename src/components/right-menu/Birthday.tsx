import { Button } from '@heroui/react';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const User = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src={
            "https://images.pexels.com/photos/31701360/pexels-photo-31701360.jpeg"
          }
          alt="Avatar"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
        <span className="text-md font-bold flex-1">Hilda May</span>
      </div>

      <div className="flex items-center gap-3">
       <Button size='sm' color="primary" radius='lg' variant='flat'>Celebrate</Button>
      </div>
    </div>
  );
}
export default function BirthDay() {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">
      {/* Top Bar */}
      <div className="flex justify-between items-center font-md">
        <span className="text-gray-500">Birthday</span>
        <Link href={"/"} className="text-blue-500 text-xs">
          See All
        </Link>
      </div>

      <div className='flex flex-col gap-4'>
        <User/>
      </div>

      {/* Upcoming */}
      <div className='py-4 px-2 bg-slate-200 rounded-lg flex gap-3 items-center'>
        <Image src={"/gift.png"} alt='Gitf' width={24} height={24} className='w-6 h-6 object-cover'/>
        <Link href={"/"} className='flex flex-col gap-1'>
          <span className='font-bold text-sm'>Upcoming Birthday</span>
          <span className='text-gray-400 text-xs line-clamp-1'>See Other 16 have upcoming birthdays</span>
        </Link>
      </div>
    </div>
  );
}
