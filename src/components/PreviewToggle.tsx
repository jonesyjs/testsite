'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function PreviewToggle({ isPreview }: { isPreview: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    
    try {
      if (isPreview) {
        // Exit preview mode
        await fetch('/api/preview', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ secret: process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_SECRET }),
        });
      } else {
        // Enter preview mode
        await fetch(`/api/preview?secret=${process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_SECRET}&slug=/`);
      }
      
      router.refresh();
    } catch (error) {
      console.error('Error toggling preview mode:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-medium transition-colors ${
        isPreview
          ? 'bg-red-600 hover:bg-red-700 text-white'
          : 'bg-green-600 hover:bg-green-700 text-white'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {loading ? 'Switching...' : isPreview ? 'Exit Preview' : 'Enable Preview'}
    </button>
  );
} 