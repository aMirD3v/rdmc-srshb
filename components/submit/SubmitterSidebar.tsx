
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FilePlus, List } from 'lucide-react';

const SubmitterSidebar = () => {
  const pathname = usePathname();

  const links = [
    { href: '/submit', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/submit/new', label: 'New Submission', icon: FilePlus },
    { href: '/submit', label: 'My Submissions', icon: List },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Submitter</h2>
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

export default SubmitterSidebar;
