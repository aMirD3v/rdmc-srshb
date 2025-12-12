'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Calendar, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const TRUNCATE_LENGTH = 200;

export default function RecentSubmissionCard({ item }: { item: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTruncated = item.abstract && item.abstract.length > TRUNCATE_LENGTH;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(item.createdAt).toLocaleDateString()}
            </span>
          </div>

          <Link href={`/items/${item.id}`}>
            <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
              {item.title}
            </h3>
          </Link>
          
          {item.abstract && (
            <p className="text-gray-600 text-sm mb-3">
              {isTruncated && !isExpanded
                ? `${item.abstract.substring(0, TRUNCATE_LENGTH)}...`
                : item.abstract}
            </p>
          )}

          {isTruncated && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800 mb-3"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
            </button>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span>by {item.submitter.name}</span>
              <span className="mx-2">•</span>
              <Link 
                href={`/collections/${item.collection.id}`}
                className="text-blue-600 hover:underline"
              >
                {item.collection.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
