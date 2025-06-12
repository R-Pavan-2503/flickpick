'use-client'

import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col items-center gap-12">
        <p className="text-5xl font-bold text-center">Welcome to flickpick</p>

        <div className="flex flex-row items-center gap-10">
          <Link
            href='/newmovies'
            className="border-4 border-red-800 w-[80%] h-96 p-8 rounded-xl flex justify-center items-center"
          >


            <p className="text-2xl font-semibold">Choose from new movies</p>

          </Link>

          <div className="border-4 border-blue-800 w-[80%] h-96 p-8 rounded-xl flex justify-center items-center">
            <p className="text-2xl font-semibold">Choose from old movies</p>
          </div>
        </div>
      </div>

    </div>
  );
}
