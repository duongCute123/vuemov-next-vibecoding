interface TrackEvent {
  eventType: 'page_view' | 'movie_view';
  ip?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  screenWidth?: number;
  screenHeight?: number;
  path?: string;
  movieSlug?: string;
  userId?: string;
  referrer?: string;
}

function detectDeviceType(): string {
  if (typeof window === 'undefined') return 'unknown';
  const w = window.innerWidth;
  if (w <= 768) return 'mobile';
  if (w <= 1024) return 'tablet';
  return 'desktop';
}

function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
}

function detectOS(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

export async function trackPageView(path: string, userId?: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'page_view',
        userAgent: navigator.userAgent,
        deviceType: detectDeviceType(),
        browser: detectBrowser(),
        os: detectOS(),
        screenWidth: screen.width,
        screenHeight: screen.height,
        path,
        referrer: document.referrer || undefined,
        userId,
      }),
    });
  } catch {
    // silently fail
  }
}

export async function trackMovieView(slug: string, userId?: string) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'movie_view',
        userAgent: navigator.userAgent,
        deviceType: detectDeviceType(),
        browser: detectBrowser(),
        os: detectOS(),
        screenWidth: screen.width,
        screenHeight: screen.height,
        path: `/phim/${slug}`,
        movieSlug: slug,
        userId,
      }),
    });
  } catch {
    // silently fail
  }
}
