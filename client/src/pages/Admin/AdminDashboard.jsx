import { useState, useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import { Users, MessageSquare, Phone, TrendingUp } from 'lucide-react'
import api from '../../services/api'

function StatCard({ icon, label, value, trend, color }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 'var(--radius-md)',
        background: `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
      </div>
      {trend && (
        <div style={{
          marginLeft: 'auto',
          fontSize: 13, fontWeight: 600,
          color: trend > 0 ? 'var(--success)' : 'var(--danger)',
        }}>
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, messages: 0, calls: 0, groups: 0 })

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data.data || stats)).catch(() => {})
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>Dashboard</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Platform overview</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
            <StatCard icon={<Users size={24} />} label="Total Users" value={stats.users} trend={12} color="var(--accent)" />
            <StatCard icon={<MessageSquare size={24} />} label="Messages Today" value={stats.messages} trend={8} color="var(--success)" />
            <StatCard icon={<Phone size={24} />} label="Calls Today" value={stats.calls} trend={-3} color="var(--warning)" />
            <StatCard icon={<TrendingUp size={24} />} label="Active Groups" value={stats.groups} trend={5} color="#ec4899" />
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, marginBottom: 16 }}>Recent Activity</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Connect analytics charts to your backend data.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
