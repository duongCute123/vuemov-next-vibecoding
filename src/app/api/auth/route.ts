import { NextRequest, NextResponse } from 'next/server';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite,
  getHistory,
  addHistory,
  removeHistory,
  clearHistory,
  getComments,
  addComment,
  deleteComment,
  getCurrentUser,
} from '@/lib/api-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;
    const user = getCurrentUser();

    switch (action) {
      case 'getFavorites': {
        const favorites = await getFavorites();
        return NextResponse.json({ favorites });
      }

      case 'addFavorite': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        await addFavorite(data.slug);
        return NextResponse.json({ success: true });
      }

      case 'removeFavorite': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        await removeFavorite(data.slug);
        return NextResponse.json({ success: true });
      }

      case 'checkFavorite': {
        const isFavorite = await checkFavorite(data.slug);
        return NextResponse.json({ isFavorite });
      }

      case 'getHistory': {
        const history = await getHistory();
        return NextResponse.json({ history });
      }

      case 'addHistory': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        await addHistory(data.slug);
        return NextResponse.json({ success: true });
      }

      case 'removeHistory': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        await removeHistory(data.slug);
        return NextResponse.json({ success: true });
      }

      case 'clearHistory': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        await clearHistory();
        return NextResponse.json({ success: true });
      }

      case 'getComments': {
        const comments = await getComments(data.slug);
        return NextResponse.json({ comments });
      }

      case 'addComment': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        const comment = await addComment(data.slug, data.content, data.rating);
        const comments = await getComments(data.slug);
        return NextResponse.json({ success: true, comments, comment });
      }

      case 'deleteComment': {
        if (!user) return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
        await deleteComment(data.commentId);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'API is running' });
}