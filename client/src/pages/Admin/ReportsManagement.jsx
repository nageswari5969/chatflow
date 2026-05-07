import { useState, useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import AdminSidebar from '../../components/admin/AdminSidebar'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { Flag, CheckCircle, XCircle } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function ReportsManagement() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/reports').then(r => setReports(r.data.data || [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleAction = async (id, action) => {
    try {
      await api.put(`/admin/reports/${id}`, { status: action })
      setReports(prev => prev.map(r => r._id === id ? { ...r, status: action } : r))
      toast.success('Report updated')
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <AdminSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>Reports</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>User-reported content</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {loading ? <Loader /> : reports.length === 0 ? (
            <EmptyState icon={<Flag size={28} />} title="No reports" description="All clear — no reports to review" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reports.map(r => (
                <div key={r._id} style={{
                  background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)', padding: '16px 20px',
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)', flexShrink: 0 }}>
                    <Flag size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{r.reason}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                      Reported by {r.reporter?.name} • {new Date(r.createdAt).toLocaleDateString()}
                    </div>
                    {r.description && <div style={{ fontSize: 13, marginTop: 8, color: 'var(--text-secondary)' }}>{r.description}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)',
                      background: r.status === 'resolved' ? 'rgba(34,197,94,0.15)' : r.status === 'dismissed' ? 'rgba(107,114,128,0.2)' : 'rgba(245,158,11,0.15)',
                      color: r.status === 'resolved' ? 'var(--success)' : r.status === 'dismissed' ? 'var(--text-muted)' : 'var(--warning)',
                    }}>
                      {r.status || 'pending'}
                    </span>
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction(r._id, 'resolved')} style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <CheckCircle size={14} />
                        </button>
                        <button onClick={() => handleAction(r._id, 'dismissed')} style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: 'rgba(107,114,128,0.15)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <XCircle size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
