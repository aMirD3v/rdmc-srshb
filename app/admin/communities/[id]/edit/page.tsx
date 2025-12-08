
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditCommunityPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCommunity = async () => {
        const response = await fetch(`/api/admin/communities/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setDescription(data.description);
        } else {
          setError('Failed to fetch community data');
        }
      };
      fetchCommunity();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name) {
      setError('Name is required');
      return;
    }

    const response = await fetch(`/api/admin/communities/${id}`,
     {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description }),
    });

    if (response.ok) {
      router.push('/admin/communities');
    } else {
      const data = await response.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Community</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">
          Update Community
        </button>
      </form>
    </div>
  );
}
