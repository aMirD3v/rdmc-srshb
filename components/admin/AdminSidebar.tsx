
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Folder, FileText } from 'lucide-react';

const AdminSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/communities', label: 'Communities', icon: Folder },
    { href: '/admin/items', label: 'Items', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Admin</h2>
      </div>
      <nav>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={`flex items-center p-2 rounded-md ${pathname === link.href ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
                <link.icon className="mr-3" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
