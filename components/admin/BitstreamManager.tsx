
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

interface Bitstream {
  id: string;
  name: string;
  mimeType: string;
  size: number;
}

export default function BitstreamManager() {
  const [bitstreams, setBitstreams] = useState<Bitstream[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const { id: itemId } = useParams();

  useEffect(() => {
    if (itemId) {
      const fetchBitstreams = async () => {
        const response = await fetch(`/api/admin/items/${itemId}/bitstreams`);
        if (response.ok) {
          const data = await response.json();
          setBitstreams(data);
        }
      };
      fetchBitstreams();
    }
  }, [itemId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`/api/admin/items/${itemId}/bitstreams`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const newBitstream = await response.json();
      setBitstreams([...bitstreams, newBitstream]);
      setFile(null);
    }
  };

  const handleDeleteBitstream = async (bitstreamId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      const response = await fetch(`/api/admin/items/${itemId}/bitstreams/${bitstreamId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBitstreams(bitstreams.filter((b) => b.id !== bitstreamId));
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">Files</h3>
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {bitstreams.map((b) => (
            <tr key={b.id}>
              <td className="px-6 py-4 whitespace-nowrap">{b.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{b.mimeType}</td>
              <td className="px-6 py-4 whitespace-nowrap">{b.size} bytes</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => handleDeleteBitstream(b.id)} className="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleUpload}>
        <h4 className="text-md font-bold mb-2">Upload New File</h4>
        <div className="flex gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border rounded-md"
          />
          <button type="submit" className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800" disabled={!file}>
            Upload
          </button>
        </div>
      </form>
    </div>
  );
}
