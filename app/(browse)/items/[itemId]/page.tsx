import { prisma } from "@/lib/prisma";

export default async function ItemPage({ params }: { params: { itemId: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.itemId },
    include: { metadata: true, bitstreams: true },
  });

  if (!item || item.status !== 'PUBLISHED') {
    return <div>Item not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">{item.title}</h1>

      <div className="bg-white shadow-md rounded-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Metadata</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {item.metadata.map((m) => (
              <tr key={m.id}>
                <td className="px-6 py-4 font-bold">{m.key}</td>
                <td className="px-6 py-4">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-xl font-bold mb-4">Files</h2>
        <ul>
          {item.bitstreams.map((b) => (
            <li key={b.id} className="flex justify-between items-center py-2">
              <a href={`/api/download/${b.id}`} className="text-blue-600 hover:underline">{b.name}</a>
              <span>{b.size} bytes</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}