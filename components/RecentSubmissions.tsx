'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface RecentItem {
  id: string;
  title: string;
  abstract: string;
}

const TRUNCATE_LENGTH = 250;

export default function RecentSubmissions() {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        const response = await fetch('/api/items/recent');
        if (!response.ok) {
          throw new Error('Failed to fetch recent submissions.');
        }
        const data = await response.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentItems();
  }, []);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <div className="text-center p-8">Loading recent submissions...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  if (items.length === 0) {
    return <div className="text-center p-8 text-gray-500">No recent submissions found.</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center">Recent Submissions</h2>
      <div className="space-y-6 max-w-4xl mx-auto">
        {items.map(item => {
          const isExpanded = expandedItems.has(item.id);
          const isTruncated = item.abstract.length > TRUNCATE_LENGTH;

          return (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
              {item.abstract && (
                <p className="text-gray-600">
                  {isTruncated && !isExpanded
                    ? `${item.abstract.substring(0, TRUNCATE_LENGTH)}...`
                    : item.abstract}
                </p>
              )}
              {isTruncated && (
                <Button 
                  onClick={() => toggleExpanded(item.id)}
                  className="text-sm mt-4 bg-transparent text-blue-600 hover:bg-blue-50 px-2 py-1"
                >
                  {isExpanded ? 'Show Less' : 'Show More'}
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
