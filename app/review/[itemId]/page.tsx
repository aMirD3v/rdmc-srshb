
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function ReviewItemPage() {
  const [item, setItem] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { itemId } = useParams();

  useEffect(() => {
    if (itemId) {
      const fetchItem = async () => {
        const response = await fetch(`/api/admin/items/${itemId}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          setError('Failed to fetch item data');
        }
        setLoading(false);
      };
      fetchItem();
    }
  }, [itemId]);

  const handleStatusUpdate = async (newStatus: 'PUBLISHED' | 'REJECTED') => {
    const response = await fetch(`/api/review/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (response.ok) {
      router.push('/review');
    } else {
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
    return <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">Item not found</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-4">Review Item: {item.title}</h1>

      <div className="bg-white shadow-md rounded-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Item Details</h2>
        <p><strong>Title:</strong> {item.title}</p>
        <p><strong>Collection:</strong> {item.collection?.name}</p>
        <p><strong>Submitter:</strong> {item.submitter?.name}</p>
        <p><strong>Current Status:</strong> {item.status}</p>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Metadata</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {item.metadata.map((m: any) => (
              <tr key={m.id}>
                <td className="px-6 py-4 font-bold">{m.key}</td>
                <td className="px-6 py-4">{m.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Files</h2>
        <ul>
          {item.bitstreams.map((b: any) => (
            <li key={b.id} className="flex justify-between items-center py-2">
              <a href={`/api/download/${b.id}`} className="text-blue-600 hover:underline">{b.name}</a>
              <span>{b.size} bytes</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-end space-x-4">
        <button 
          onClick={() => handleStatusUpdate('REJECTED')}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
        >
          Reject
        </button>
        <button 
          onClick={() => handleStatusUpdate('PUBLISHED')}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Approve
        </button>
      </div>
    </div>
  );
}
