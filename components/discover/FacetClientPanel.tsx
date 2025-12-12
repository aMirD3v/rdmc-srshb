'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';

interface Facet {
    name: string;
    count: number;
}

interface FacetClientPanelProps {
    data: Facet[];
    facetName: string;
}

export default function FacetClientPanel({ data, facetName }: FacetClientPanelProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-2">
                <Input 
                    type="text"
                    placeholder={`Search ${facetName}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-8 text-sm"
                />
            </div>
            {filteredData.length > 0 ? (
                <ul className="space-y-1 max-h-48 overflow-y-auto">
                    {filteredData.map(item => (
                        <li key={item.name}>
                            <Link 
                                href={`/search?facet=${facetName}&query=${encodeURIComponent(item.name)}`}
                                className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 text-sm group"
                            >
                                <span className="text-gray-700 group-hover:text-blue-600 truncate pr-2 capitalize">{item.name}</span>
                                <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-600 flex-shrink-0">{item.count}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gray-500 p-2">No {facetName} found.</p>
            )}
            <div className="mt-2 pt-2 border-t">
                <Link href={`/browse/${facetName}s`} className="text-sm font-semibold text-blue-600 hover:underline">
                    Browse all...
                </Link>
            </div>
        </div>
    );
}
