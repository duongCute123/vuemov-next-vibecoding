'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { addHistory } from '@/lib/api-service';

export default function AddHistoryTracker({ slug }: { slug: string }) {
  const { user } = useAuth();

  useEffect(() => {
    if (user && slug) {
      addHistory(slug).catch(console.error);
    }
  }, [user, slug]);

  return null;
}
