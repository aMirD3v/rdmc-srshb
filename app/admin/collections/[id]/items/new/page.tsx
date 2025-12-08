
'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function NewItemPage() {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id: collectionId } = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Title is required');
      return;
    }

    const response = await fetch('/api/admin/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, collectionId }),
    });

    if (response.ok) {
      const item = await response.json();
      router.push(`/admin/items/${item.id}/edit`);
    } else {
      const data = await response.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">New Item</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md">
          Create Item
        </button>
      </form>
    </div>
  );
}
