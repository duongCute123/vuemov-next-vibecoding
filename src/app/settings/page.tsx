'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAppDispatch } from '@/lib/store/hooks';
import { updateProfile } from '@/lib/store/authSlice';
import { changePassword as changePasswordApi } from '@/lib/api-service';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Tab = 'profile' | 'password' | 'preferences';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('profile');

  useEffect(() => {
    document.title = 'Cài đặt | NhungMov';
  }, []);

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
    if (user) {
      setUsername(user.username);
      setAvatar(user.avatar || '');
    }
  }, [user, authLoading, router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await dispatch(updateProfile({ username, avatar })).unwrap();
      if (result) {
        setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
      }
    } catch (err: unknown) {
      setMessage({ type: 'error', text: (typeof err === 'string' ? err : null) || 'Cập nhật thất bại' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }
    setChangingPassword(true);
    setMessage(null);
    try {
      const result = await changePasswordApi(currentPassword, newPassword);
      if (result.success) {
        setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setMessage({ type: 'error', text: result.message || 'Đổi mật khẩu thất bại' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Đổi mật khẩu thất bại';
      setMessage({ type: 'error', text: message });
    } finally {
      setChangingPassword(false);
    }
  };

  if (authLoading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl">Đang tải...</div>
      </main>
    );
  }

  if (!user) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: 'Hồ sơ' },
    { id: 'password', label: 'Mật khẩu' },
    { id: 'preferences', label: 'Tùy chỉnh' },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />

      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-zinc-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Cài đặt</h1>
              <p className="text-zinc-400 text-sm mt-1">Quản lý tài khoản của bạn</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setMessage(null); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                tab === t.id
                  ? 'bg-cyan-400 text-zinc-950'
                  : 'border border-white/10 text-zinc-300 hover:border-cyan-400/30'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {message && (
          <div className={`mb-6 px-4 py-3 rounded-xl text-sm ${
            message.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            {message.text}
          </div>
        )}

        {tab === 'profile' && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-6">Thông tin hồ sơ</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Email</label>
                <input type="email" value={user.email} disabled className="w-full rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-3 text-sm text-zinc-400 cursor-not-allowed" />
                <p className="text-xs text-zinc-500 mt-1">Email không thể thay đổi</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Tên hiển thị</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition"
                  placeholder="Nhập tên hiển thị"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Avatar URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition"
                  placeholder="https://example.com/avatar.jpg"
                />
                {avatar && (
                  <div className="mt-3 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={avatar} alt="avatar preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <span className="text-xs text-zinc-500">Xem trước</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-cyan-400 text-zinc-950 font-semibold hover:bg-cyan-300 transition disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </div>
        )}

        {tab === 'password' && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-6">Đổi mật khẩu</h2>
            <div className="space-y-5 max-w-md">
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Mật khẩu hiện tại</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Mật khẩu mới</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-zinc-500 mb-2">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                className="px-6 py-3 rounded-xl bg-cyan-400 text-zinc-950 font-semibold hover:bg-cyan-300 transition disabled:opacity-50"
              >
                {changingPassword ? 'Đang đổi...' : 'Đổi mật khẩu'}
              </button>
            </div>
          </div>
        )}

        {tab === 'preferences' && (
          <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-6">Tùy chỉnh</h2>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-medium text-white">Ngôn ngữ</p>
                  <p className="text-xs text-zinc-400 mt-1">Tiếng Việt</p>
                </div>
                <span className="px-3 py-1 bg-cyan-400/20 text-cyan-300 rounded-full text-xs">Mặc định</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="font-medium text-white">Thông báo</p>
                  <p className="text-xs text-zinc-400 mt-1">Nhận thông báo về phim mới</p>
                </div>
                <div className="w-12 h-6 rounded-full bg-cyan-400/30 relative cursor-pointer">
                  <div className="w-5 h-5 rounded-full bg-cyan-400 absolute top-0.5 right-0.5 shadow" />
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-4">Các tùy chỉnh bổ sung sẽ được cập nhật sau.</p>
            </div>
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  );
}
