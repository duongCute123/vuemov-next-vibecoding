import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('nhungmov_token')?.value;
  const userCookie = request.cookies.get('nhungmov_user')?.value;

  if (!token) {
    return NextResponse.json({ user: null, token: null });
  }

  let user = null;

  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const data = await response.json();
      user = data.data || data.user || null;
    }
  } catch {
    // Fallback to cookie if backend me endpoint unavailable
  }

  if (!user && userCookie) {
    try {
      user = JSON.parse(userCookie);
    } catch {
      // Invalid cookie
    }
  }

  if (user && !user.role) {
    user.role = 'user';
  }

  return NextResponse.json({ user, token });
}
