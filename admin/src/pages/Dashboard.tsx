import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface Stats {
  totalOrders: number;
  pendingQuotes: number;
  activeItems: number;
  revenue: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Placeholder: fetch stats from API
    // In production, this would hit /api/admin/stats/
    setStats({
      totalOrders: 0,
      pendingQuotes: 0,
      activeItems: 0,
      revenue: '0.00',
    });
  }, []);

  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p className="subtitle">Welcome back. Here's what's happening at Joelle's Pastries.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{stats?.totalOrders ?? '—'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending Quotes</span>
          <span className="stat-value">{stats?.pendingQuotes ?? '—'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Active Menu Items</span>
          <span className="stat-value">{stats?.activeItems ?? '—'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Revenue</span>
          <span className="stat-value">${stats?.revenue ?? '—'}</span>
        </div>
      </div>

      <div className="card">
        <h3>Recent Activity</h3>
        <p className="muted">No recent activity. Orders and quote requests will appear here.</p>
      </div>
    </div>
  );
}
