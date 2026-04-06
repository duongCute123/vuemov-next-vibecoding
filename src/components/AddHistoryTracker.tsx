'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function AddHistoryTracker({ slug }: { slug: string }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && slug) {
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'addHistory', 
          userId: user.id, 
          slug 
        }),
      }).catch(console.error);
    }
  }, [user, slug]);

  return null;
}
