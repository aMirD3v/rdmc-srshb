
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Metadata {
  id: string;
  key: string;
  value: string;
}

export default function MetadataManager() {
  const [metadata, setMetadata] = useState<Metadata[]>([]);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const { id: itemId } = useParams();

  useEffect(() => {
    if (itemId) {
      const fetchMetadata = async () => {
        const response = await fetch(`/api/admin/items/${itemId}/metadata`);
        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
        }
      };
      fetchMetadata();
    }
  }, [itemId]);

  const handleAddMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey || !newValue) return;

    const response = await fetch(`/api/admin/items/${itemId}/metadata`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: newKey, value: newValue }),
    });

    if (response.ok) {
      const newMetadata = await response.json();
      setMetadata([...metadata, newMetadata]);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleDeleteMetadata = async (metadataId: string) => {
    if (confirm('Are you sure you want to delete this metadata field?')) {
      const response = await fetch(`/api/admin/items/${itemId}/metadata/${metadataId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMetadata(metadata.filter((m) => m.id !== metadataId));
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Metadata</h3>
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {metadata.map((m) => (
            <tr key={m.id}>
              <td className="px-6 py-4 whitespace-nowrap">{m.key}</td>
              <td className="px-6 py-4 whitespace-nowrap">{m.value}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => handleDeleteMetadata(m.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAddMetadata}>
        <h4 className="text-md font-bold mb-2">Add New Metadata</h4>
        <div className="flex gap-4">
          <input
            type="text"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="Key (e.g., dc.creator)"
            className="w-full px-3 py-2 border rounded-md"
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 border rounded-md"
          />
          <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">Add</button>
        </div>
      </form>
    </div>
  );
}
