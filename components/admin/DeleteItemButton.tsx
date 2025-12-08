
'use client';

import { useRouter } from 'next/navigation';

export default function DeleteItemButton({ itemId, collectionId }: { itemId: string, collectionId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this item?')) {
      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/admin/collections/${collectionId}/items`);
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="w-full bg-red-500 text-white py-2 rounded-md mt-4">
      Delete Item
    </button>
  );
}
