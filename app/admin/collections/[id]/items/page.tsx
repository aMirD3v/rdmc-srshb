
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 10;

export default async function AdminCollectionItemsPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams.page || '1', 10);

  const totalItems = await prisma.item.count({
    where: { collectionId: params.id },
  });
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);

  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
    include: {
      items: {
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      },
    },
  });

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Items in {collection.name}</h1>
        <Link href={`/admin/collections/${params.id}/items/new`} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">New Item</Link>
      </div>
      <div className="bg-white shadow-md rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Handle</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {collection.items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.handle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/items/${item.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/admin/collections/${params.id}/items`} />
    </div>
  );
}
