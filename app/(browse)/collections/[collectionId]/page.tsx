import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function CollectionPage({ params }: { params: { collectionId: string } }) {
  const collection = await prisma.collection.findUnique({
    where: { id: params.collectionId },
    include: {
      items: {
        where: { status: 'PUBLISHED' },
      },
    },
  });

  if (!collection) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">{collection.name}</h1>
      <p className="text-gray-700 mb-8">{collection.description}</p>

      <h2 className="text-2xl font-bold mb-4">Items</h2>
      <div className="divide-y divide-gray-200">
        {collection.items.map((item) => (
          <div key={item.id} className="py-4">
            <Link href={`/items/${item.id}`}>
              <h3 className="text-xl text-blue-600 hover:underline cursor-pointer">{item.title}</h3>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}