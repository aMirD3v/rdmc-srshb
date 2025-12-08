
'use client';

import { useRouter } from 'next/navigation';

export default function DeleteCommunityButton({ communityId }: { communityId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this community?')) {
      const response = await fetch(`/api/admin/communities/${communityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong');
      }
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
  );
}
