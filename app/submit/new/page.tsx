
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewSubmissionPage() {
  const [title, setTitle] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [collections, setCollections] = useState<any[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCollections = async () => {
      const response = await fetch('/api/collections'); // Assuming a public API to list collections
      if (response.ok) {
        const data = await response.json();
        setCollections(data);
        if (data.length > 0) {
          setCollectionId(data[0].id);
        }
      } else {
        setError('Failed to fetch collections');
      }
    };
    fetchCollections();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title || !collectionId) {
      setError('Title and Collection are required');
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
      router.push(`/submit/${item.id}/edit`);
    } else {
      const data = await response.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">New Submission</h1>
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
        <div className="mb-4">
          <label className="block text-gray-700">Collection</label>
          <select
            value={collectionId}
            onChange={(e) => setCollectionId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">
          Create Submission
        </button>
      </form>
    </div>
  );
}
