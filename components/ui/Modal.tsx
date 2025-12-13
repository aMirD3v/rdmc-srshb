
'use client';

import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: React.ReactNode }) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex">
      <div className="bg-white p-6 rounded-md shadow-md absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
