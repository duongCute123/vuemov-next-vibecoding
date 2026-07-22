import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';

export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!body.ip) {
    let ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';
    if (!ip) ip = request.headers.get('x-real-ip') || '';
    if (ip) body.ip = ip;
  }

  const response = await fetch(`${BACKEND_URL}/api/analytics/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data);
}
