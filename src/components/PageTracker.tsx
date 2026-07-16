'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { trackPageView } from '@/lib/analytics-client';

export default function PageTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const lastPath = useRef('');

  useEffect(() => {
    if (pathname === lastPath.current) return;
    lastPath.current = pathname;
    trackPageView(pathname, user?.id).catch(() => {});
  }, [pathname, user?.id]);

  return null;
}
