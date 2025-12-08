import DeleteCommunityButton from "@/components/admin/DeleteCommunityButton";
import Pagination from "@/components/ui/Pagination";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

const PAGE_SIZE = 10;

export default async function AdminCommunitiesPage({ searchParams }: { searchParams: { page?: string } }) {
  const currentPage = parseInt(searchParams.page || '1', 10);

  const totalCommunities = await prisma.community.count();
  const totalPages = Math.ceil(totalCommunities / PAGE_SIZE);

  const communities = await prisma.community.findMany({
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Communities</h1>
        <Link href="/admin/communities/new" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">New Community</Link>
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
            {communities.map((community) => (
              <tr key={community.id}>
                <td className="px-6 py-4 whitespace-nowrap">{community.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{community.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/communities/${community.id}/edit`} className="text-indigo-600 hover:text-indigo-900">Edit</Link>
                  <Link href={`/admin/communities/${community.id}/collections`} className="text-green-600 hover:text-green-900 ml-4">View Collections</Link>
                  <DeleteCommunityButton communityId={community.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl="/admin/communities" />
    </div>
  );
}
