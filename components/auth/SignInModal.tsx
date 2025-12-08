
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';

export default function SignInModal() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setIsLoading(false);
      setError(result.error);
    } else if (result?.ok) {
      setOpen(false);
      router.refresh(); // Refresh the page to update the session and UI
    } else {
      setIsLoading(false);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <>
      <button onClick={() => setOpen(true)} className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">
        Sign In
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-800" disabled={isLoading}>
            Sign In
          </button>
        </form>
      </Modal>
    </>
  );
}
