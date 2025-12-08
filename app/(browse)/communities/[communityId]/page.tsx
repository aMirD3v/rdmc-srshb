import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CommunityPage({ params }: { params: { communityId: string } }) {
  const community = await prisma.community.findUnique({
    where: { id: params.communityId },
    include: { collections: true },
  });

  if (!community) {
    return <div>Community not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
      <p className="text-gray-700 mb-8">{community.description}</p>

      <h2 className="text-2xl font-bold mb-4">Collections</h2>
      <div className="space-y-4">
        {community.collections.map((collection) => (
          <div key={collection.id} className="p-4 border rounded-md">
            <Link href={`/collections/${collection.id}`}>
              <h3 className="text-xl text-blue-600 hover:underline cursor-pointer">{collection.name}</h3>
            </Link>
            <p className="text-gray-700">{collection.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}