
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 10;

export default async function SearchPage({ searchParams }: { searchParams: { q: string, page?: string } }) {
  const query = searchParams.q;
  const currentPage = parseInt(searchParams.page || '1', 10);

  let items = [];
  let totalItems = 0;

  if (query) {
    const where = {
      status: 'PUBLISHED',
      OR: [
        {
          title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          metadata: {
            some: {
              value: {
                contains: query,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    };

    totalItems = await prisma.item.count({ where });
    items = await prisma.item.findMany({
      where,
      include: {
        collection: true,
      },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  }

  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <p className="mb-8">Found {totalItems} results for "{query}"</p>

      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <div key={item.id} className="py-4">
            <Link href={`/items/${item.id}`}>
              <h3 className="text-xl text-blue-600 hover:underline cursor-pointer">{item.title}</h3>
            </Link>
            <p className="text-gray-700">In collection: {item.collection.name}</p>
          </div>
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/search?q=${query}`} />
    </div>
  );
}
