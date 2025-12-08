
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditUserPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('USER');
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const response = await fetch(`/api/admin/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setName(data.name);
          setEmail(data.email);
          setRole(data.role);
        } else {
          setError('Failed to fetch user data');
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Name and email are required');
      return;
    }

    const response = await fetch(`/api/admin/users/${id}`,
     {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, role }),
    });

    if (response.ok) {
      router.push('/admin/users');
    } else {
      const data = await response.json();
      setError(data.error || 'Something went wrong');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Edit User</h1>
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
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="SUBMITTER">SUBMITTER</option>
            <option value="REVIEWER">REVIEWER</option>
          </select>
        </div>
        <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800">
          Update User
        </button>
      </form>
    </div>
  );
}
