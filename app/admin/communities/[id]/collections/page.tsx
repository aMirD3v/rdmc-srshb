import DeleteCollectionButton from "@/components/admin/DeleteCollectionButton";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 10;

export default async function AdminCommunityCollectionsPage({ params, searchParams }: { params: { id: string }, searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams.page || '1', 10);

  const totalCollections = await prisma.collection.count({
    where: { communityId: params.id },
  });
  const totalPages = Math.ceil(totalCollections / PAGE_SIZE);

  const community = await prisma.community.findUnique({
    where: { id: params.id },
    include: {
      collections: {
        skip: (currentPage - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      },
    },
  });

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Collections in {community.name}</h1>
        <Link href={`/admin/communities/${params.id}/collections/new`} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">New Collection</Link>
      </div>
      <div className="bg-white shadow-md rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {community.collections.map((collection) => (
              <tr key={collection.id}>
                <td className="px-6 py-4 whitespace-nowrap">{collection.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{collection.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/collections/${collection.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                  <Link href={`/admin/collections/${collection.id}/items`} className="text-green-600 hover:text-green-900 ml-4">View Items</Link>
                  <DeleteCollectionButton collectionId={collection.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={`/admin/communities/${params.id}/collections`} />
    </div>
  );
}
