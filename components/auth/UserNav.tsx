"use client";

import React from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

const UserNav = () => {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      {session.user.image && (
        <Image
          src={session.user.image}
          alt={session.user.name || "User avatar"}
          width={32}
          height={32}
          className="rounded-full"
        />
      )}
      <span>{session.user.name}</span>
      <span>{session.user.name}</span>
      <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">Sign Out</button>
    </div>
  );
};

export default UserNav;
