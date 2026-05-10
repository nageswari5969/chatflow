
// DashboardCard
export function DashboardCard({ icon, label, value, color = 'var(--accent)' }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 'var(--radius-md)',
        background: `${color}22`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'var(--font-display)' }}>{value}</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</div>
      </div>
    </div>
  )
}

// StatsOverview
export function StatsOverview({ stats = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} style={{
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{value}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{key}</div>
        </div>
      ))}
    </div>
  )
}

// AnalyticsChart placeholder
export function AnalyticsChart({ title }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 24,
    }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>{title}</h3>
      <div style={{
        height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)', fontSize: 13,
        borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)',
      }}>
        Connect chart library (e.g. Recharts) to display data
      </div>
    </div>
  )
}
