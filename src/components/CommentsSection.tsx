'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}

interface CommentsSectionProps {
  slug: string;
  movieTitle: string;
}

export default function CommentsSection({ slug, movieTitle }: CommentsSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [slug]);

  const loadComments = async () => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'getComments', slug }),
      });
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addComment',
          slug,
          userId: user.id,
          username: user.username,
          content: newComment,
          rating,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
        setNewComment('');
        setRating(5);
      }
    } catch (err) {
      console.error('Error submitting comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!user) return;
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'deleteComment', slug, commentId, userId: user.id }),
      });
      setComments(comments.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.rating, 0) / comments.length).toFixed(1)
    : null;

  return (
    <div className="mt-8 rounded-[28px] border border-white/10 bg-zinc-900/60 p-5 backdrop-blur sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Bình luận & Đánh giá</h3>
          <p className="text-sm text-zinc-400">Chia sẻ cảm nghĩ về "{movieTitle}"</p>
        </div>
        {averageRating && (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-400">{averageRating}</span>
            <span className="text-zinc-500 text-sm">/ 5 ({comments.length} đánh giá)</span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-6 text-zinc-400">Đang tải bình luận...</div>
      ) : (
        <>
          {user ? (
            <form onSubmit={handleSubmit} className="mb-6 pb-6 border-b border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-zinc-400">Đánh giá:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-xl transition ${
                        star <= rating ? 'text-yellow-400' : 'text-zinc-600 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full h-24 bg-zinc-800/50 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-500 resize-none focus:outline-none focus:border-cyan-400/50"
                required
              />
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="mt-3 rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
              </button>
            </form>
          ) : (
            <div className="mb-6 pb-6 border-b border-white/10 rounded-xl bg-zinc-800/30 p-4 text-center">
              <p className="text-zinc-400">Vui lòng đăng nhập để bình luận và đánh giá</p>
              <a href="/auth" className="inline-block mt-2 text-cyan-400 hover:text-cyan-300 font-medium">
                Đăng nhập ngay
              </a>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-zinc-950">
                        {comment.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-white">{comment.username}</p>
                        <p className="text-xs text-zinc-500">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= comment.rating ? 'text-yellow-400' : 'text-zinc-600'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-zinc-300">{comment.content}</p>
                  {user && (user.id === comment.userId) && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="mt-2 text-xs text-red-400 hover:text-red-300"
                    >
                      Xóa bình luận
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}