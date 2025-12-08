
'use client';

import UserNav from "@/components/auth/UserNav";

export default function AdminNavbar() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <UserNav />
      </div>
    </header>
  );
}
