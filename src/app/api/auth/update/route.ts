import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('nhungmov_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid response from server' }, { status: 500 });
    }

    if (data.success && data.data) {
      const user = {
        id: data.data.id,
        email: data.data.email,
        username: data.data.username,
        avatar: data.data.avatar,
      };

      const res = NextResponse.json(data);
      res.cookies.set('nhungmov_user', JSON.stringify(user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });

      return res;
    }

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
