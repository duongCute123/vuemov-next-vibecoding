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
  latitude?: number;
  longitude?: number;
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

let cachedLocation: { lat: number; lng: number } | null = null;

function getBrowserLocation(): Promise<{ lat: number; lng: number } | null> {
  if (cachedLocation) return Promise.resolve(cachedLocation);

  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        cachedLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        resolve(cachedLocation);
      },
      () => resolve(null),
      { timeout: 5000, maximumAge: 300000 }
    );
  });
}

async function buildEvent(base: Omit<TrackEvent, 'latitude' | 'longitude'>): Promise<TrackEvent> {
  const geo = await getBrowserLocation();
  const event: TrackEvent = { ...base };
  if (geo) {
    event.latitude = geo.lat;
    event.longitude = geo.lng;
  }
  return event;
}

export async function trackPageView(path: string, userId?: string) {
  try {
    const event = await buildEvent({
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
    });

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // silently fail
  }
}

export async function trackMovieView(slug: string, userId?: string) {
  try {
    const event = await buildEvent({
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
    });

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
  } catch {
    // silently fail
  }
}
