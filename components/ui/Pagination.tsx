
'use client';

import Link from 'next/link';

export default function Pagination({ currentPage, totalPages, baseUrl }: { currentPage: number, totalPages: number, baseUrl: string }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      {pages.map((page) => (
        <Link 
          key={page}
          href={`${baseUrl}?page=${page}`}
          className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
        >
          {page}
        </Link>
      ))}
    </div>
  );
}
