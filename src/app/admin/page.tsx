'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Tooltip, Legend, Filler);

interface DashboardStats {
  todayVisits: number;
  yesterdayVisits: number;
  weekVisits: number;
  monthVisits: number;
  todayMovieViews: number;
  todayUniqueUsers: number;
  totalEvents: number;
}

interface NameCount {
  name: string;
  count: number;
}

interface TopMovie {
  slug: string;
  views: number;
}

interface TrendDay {
  date: string;
  label: string;
  visits: number;
  movieViews: number;
}

interface Activity {
  eventType: string;
  path: string;
  movieSlug: string;
  deviceType: string;
  browser: string;
  os: string;
  timestamp: string;
}

const COLORS = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#14b8a6'];

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [devices, setDevices] = useState<NameCount[]>([]);
  const [browsers, setBrowsers] = useState<NameCount[]>([]);
  const [osList, setOsList] = useState<NameCount[]>([]);
  const [topMovies, setTopMovies] = useState<TopMovie[]>([]);
  const [trend, setTrend] = useState<TrendDay[]>([]);
  const [recent, setRecent] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [dashRes, devRes, brRes, osRes, topRes, trendRes, recRes] = await Promise.all([
        fetch('/api/analytics/dashboard'),
        fetch('/api/analytics/devices'),
        fetch('/api/analytics/browsers'),
        fetch('/api/analytics/os'),
        fetch('/api/analytics/top-movies?limit=10'),
        fetch('/api/analytics/trend?days=7'),
        fetch('/api/analytics/recent?limit=20'),
      ]);

      const [dash, dev, br, os, top, trendData, rec] = await Promise.all([
        dashRes.json(),
        devRes.json(),
        brRes.json(),
        osRes.json(),
        topRes.json(),
        trendRes.json(),
        recRes.json(),
      ]);

      if (dash.success) setStats(dash.data);
      if (dev.success) setDevices(dev.data);
      if (br.success) setBrowsers(br.data);
      if (os.success) setOsList(os.data);
      if (top.success) setTopMovies(top.data);
      if (trendData.success) setTrend(trendData.data);
      if (rec.success) setRecent(rec.data);
    } catch {
      // error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user, fetchData]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  const deviceChartData = {
    labels: devices.map((d) => d.name),
    datasets: [{ data: devices.map((d) => d.count), backgroundColor: COLORS, borderWidth: 0 }],
  };

  const browserChartData = {
    labels: browsers.map((b) => b.name),
    datasets: [{
      data: browsers.map((b) => b.count),
      backgroundColor: 'rgba(139, 92, 246, 0.6)',
      borderColor: '#8b5cf6',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const osChartData = {
    labels: osList.map((o) => o.name),
    datasets: [{
      data: osList.map((o) => o.count),
      backgroundColor: 'rgba(236, 72, 153, 0.6)',
      borderColor: '#ec4899',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const trendChartData = {
    labels: trend.map((t) => t.label),
    datasets: [
      {
        label: 'Lượt truy cập',
        data: trend.map((t) => t.visits),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Xem phim',
        data: trend.map((t) => t.movieViews),
        borderColor: '#ec4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#a1a1aa', font: { size: 12 } } } },
    scales: {
      x: { ticks: { color: '#71717a' }, grid: { color: 'rgba(63, 63, 70, 0.3)' } },
      y: { ticks: { color: '#71717a' }, grid: { color: 'rgba(63, 63, 70, 0.3)' } },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const, labels: { color: '#a1a1aa', padding: 12, font: { size: 11 } } } },
    cutout: '60%',
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Thống kê truy cập và xem phim</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Hôm nay" value={stats?.todayVisits ?? 0} icon="eye" color="purple" />
          <StatCard label="Hôm qua" value={stats?.yesterdayVisits ?? 0} icon="eye" color="cyan" />
          <StatCard label="7 ngày" value={stats?.weekVisits ?? 0} icon="calendar" color="pink" />
          <StatCard label="30 ngày" value={stats?.monthVisits ?? 0} icon="chart" color="green" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Xem phim hôm nay" value={stats?.todayMovieViews ?? 0} icon="film" color="amber" />
          <StatCard label="User hôm nay" value={stats?.todayUniqueUsers ?? 0} icon="user" color="blue" />
          <StatCard label="Tổng sự kiện" value={stats?.totalEvents ?? 0} icon="database" color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Thiết bị</h3>
            <div className="h-56">
              {devices.length > 0 ? <Doughnut data={deviceChartData} options={doughnutOptions} /> : <EmptyChart />}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Trình duyệt</h3>
            <div className="h-56">
              {browsers.length > 0 ? <Bar data={browserChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /> : <EmptyChart />}
            </div>
          </div>
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Hệ điều hành</h3>
            <div className="h-56">
              {osList.length > 0 ? <Bar data={osChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} /> : <EmptyChart />}
            </div>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 mb-8">
          <h3 className="text-sm font-medium text-zinc-400 mb-4">Lượt truy cập 7 ngày</h3>
          <div className="h-64">
            {trend.length > 0 ? <Line data={trendChartData} options={chartOptions} /> : <EmptyChart />}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Top phim xem nhiều</h3>
            {topMovies.length > 0 ? (
              <div className="space-y-2">
                {topMovies.map((m, i) => (
                  <div key={m.slug} className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                      {i + 1}
                    </span>
                    <a href={`/phim/${m.slug}`} className="flex-1 text-sm text-zinc-300 hover:text-white truncate">
                      {m.slug}
                    </a>
                    <span className="text-xs text-zinc-500">{m.views} lượt</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">Chưa có dữ liệu</p>
            )}
          </div>

          <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
            <h3 className="text-sm font-medium text-zinc-400 mb-4">Hoạt động gần đây</h3>
            {recent.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recent.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.eventType === 'movie_view' ? 'bg-pink-500' : 'bg-purple-500'}`} />
                    <div className="flex-1 min-w-0">
                      <span className="text-zinc-400">
                        {a.eventType === 'movie_view' ? 'Xem phim' : 'Truy cập'}
                      </span>
                      {a.movieSlug && (
                        <a href={`/phim/${a.movieSlug}`} className="text-zinc-200 hover:text-white ml-1 truncate">
                          {a.movieSlug}
                        </a>
                      )}
                      {a.path && !a.movieSlug && (
                        <span className="text-zinc-300 ml-1">{a.path}</span>
                      )}
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-zinc-600 text-xs">{a.deviceType}</span>
                        <span className="text-zinc-600 text-xs">{a.browser}</span>
                        <span className="text-zinc-600 text-xs">{a.os}</span>
                      </div>
                    </div>
                    <span className="text-zinc-600 text-xs shrink-0">
                      {new Date(a.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  const colorMap: Record<string, string> = {
    purple: 'from-purple-500/20 to-purple-600/10 text-purple-400',
    cyan: 'from-cyan-500/20 to-cyan-600/10 text-cyan-400',
    pink: 'from-pink-500/20 to-pink-600/10 text-pink-400',
    green: 'from-green-500/20 to-green-600/10 text-green-400',
    amber: 'from-amber-500/20 to-amber-600/10 text-amber-400',
    blue: 'from-blue-500/20 to-blue-600/10 text-blue-400',
    red: 'from-red-500/20 to-red-600/10 text-red-400',
  };

  const icons: Record<string, JSX.Element> = {
    eye: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    calendar: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    chart: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    film: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>,
    user: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    database: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>,
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color] || colorMap.purple} rounded-2xl p-4 border border-zinc-800/50`}>
      <div className="flex items-center gap-2 mb-2">
        {icons[icon] || icons.eye}
        <span className="text-xs text-zinc-500">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value.toLocaleString('vi-VN')}</p>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="h-full flex items-center justify-center">
      <p className="text-zinc-600 text-sm">Chưa có dữ liệu</p>
    </div>
  );
}
