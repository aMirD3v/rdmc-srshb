
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

import BitstreamManager from '@/components/admin/BitstreamManager';
import DeleteItemButton from '@/components/admin/DeleteItemButton';
import MetadataManager from '@/components/admin/MetadataManager';

export default function EditItemPage() {
  const [title, setTitle] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchItem = async () => {
        const response = await fetch(`/api/admin/items/${id}`);
        if (response.ok) {
          const data = await response.json();
          setTitle(data.title);
          setCollectionId(data.collectionId);
        } else {
          setError('Failed to fetch item data');
        }
      };
      fetchItem();
    }
  }, [id]);

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title) {
      setError('Title is required');
      return;
    }

    const response = await fetch(`/api/admin/items/${id}`,
     {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Item</h1>
      <form onSubmit={handleTitleSubmit} className="bg-white p-6 rounded-md shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Basic Information</h2>
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
        <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">
          Update Title
        </button>
      </form>

      {/* Metadata Section */}
      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <MetadataManager />
      </div>

      {/* Bitstream Section */}
      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <BitstreamManager />
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Delete Item</h2>
        <p className="text-gray-600 mb-4">This action cannot be undone. This will permanently delete the item and all of its associated metadata and files.</p>
        <DeleteItemButton itemId={id as string} collectionId={collectionId} />
      </div>
    </div>
  );
}
