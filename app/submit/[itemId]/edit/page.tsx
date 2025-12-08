
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import MetadataManager from '@/components/admin/MetadataManager';
import BitstreamManager from '@/components/admin/BitstreamManager';
import { useSession } from 'next-auth/react';

export default function EditSubmittedItemPage() {
  const [title, setTitle] = useState('');
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { itemId } = useParams();
  const { data: session } = useSession();

  const isEditable = item && (item.status === 'DRAFT' || item.status === 'REJECTED');

  useEffect(() => {
    if (itemId && session?.user?.id) {
      const fetchItem = async () => {
        const response = await fetch(`/api/submit/items/${itemId}`);
        if (response.ok) {
          const data = await response.json();
          // Ensure the current user is the submitter or an admin
          if (data.submitterId === session.user.id || session.user.role === 'ADMIN') {
            setItem(data);
            setTitle(data.title);
          } else {
            setError('You are not authorized to edit this item.');
          }
        } else {
          setError('Failed to fetch item data');
        }
        setLoading(false);
      };
      fetchItem();
    }
  }, [itemId, session]);

  const handleTitleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isEditable) {
      setError('This item cannot be edited in its current status.');
      return;
    }

    if (!title) {
      setError('Title is required');
      return;
    }

    const response = await fetch(`/api/submit/items/${itemId}`,
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

  if (loading) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-red-500">Error: {error}</div>;
  }

  if (!item) {
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">Item not found or unauthorized.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit Submission: {item.title}</h1>
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
            disabled={!isEditable}
          />
        </div>
        <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800" disabled={!isEditable}>
          Update Title
        </button>
      </form>

      {/* Metadata Section */}
      <div className="bg-white p-6 rounded-md shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Metadata</h2>
        <MetadataManager />
      </div>

      {/* Bitstream Section */}
      <div className="bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Files</h2>
        <BitstreamManager />
      </div>
    </div>
  );
}
