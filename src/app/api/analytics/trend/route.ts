import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('nhungmov_token')?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  if (!searchParams.has('days')) {
    searchParams.set('days', '7');
  }
  const response = await fetch(`${BACKEND_URL}/api/analytics/trend?${searchParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return NextResponse.json(data);
}
