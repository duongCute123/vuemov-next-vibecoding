import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid response from server' },
        { status: 500 }
      );
    }

    if (data.success && data.data?.token) {
      const user = {
        id: data.data.id,
        email: data.data.email,
        username: data.data.username,
        avatar: data.data.avatar,
      };

      const res = NextResponse.json(data);

      res.cookies.set('nhungmov_token', data.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });

      res.cookies.set('nhungmov_user', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: COOKIE_MAX_AGE,
      });

      return res;
    }

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error: any) {
    console.error('Register proxy error:', error);
    const isConnRefused = error?.cause?.code === 'ECONNREFUSED';
    return NextResponse.json(
      {
        success: false,
        message: isConnRefused
          ? `Cannot connect to backend server at ${BACKEND_URL}. Is it running?`
          : 'Server error',
      },
      { status: 500 }
    );
  }
}
