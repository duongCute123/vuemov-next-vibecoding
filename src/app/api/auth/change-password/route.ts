import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('nhungmov_token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
      method: 'POST',
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

    return NextResponse.json(data, { status: response.ok ? 200 : response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
