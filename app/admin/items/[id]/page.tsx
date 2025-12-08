
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminItemViewPage({ params }: { params: { id: string } }) {
  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: { metadata: true, bitstreams: true },
  });

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{item.title}</h1>
        <Link href={`/admin/items/${item.id}/edit`} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">Edit Item</Link>
      </div>

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
