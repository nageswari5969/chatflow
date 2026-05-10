

import { CheckCircle, XCircle, Flag } from 'lucide-react'

export default function ReportsTable({ reports = [], onAction }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {reports.map(r => (
        <div key={r._id} style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <Flag size={16} color="var(--danger)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{r.reason}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              by {r.reporter?.name} • {new Date(r.createdAt).toLocaleDateString()}
            </div>
          </div>
          <span style={{
            fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: r.status === 'resolved' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)',
            color: r.status === 'resolved' ? 'var(--success)' : 'var(--warning)',
          }}>
            {r.status}
          </span>
          {r.status === 'pending' && (
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => onAction(r._id, 'resolved')} style={{ color: 'var(--success)', cursor: 'pointer', display: 'flex' }}>
                <CheckCircle size={18} />
              </button>
              <button onClick={() => onAction(r._id, 'dismissed')} style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <XCircle size={18} />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
