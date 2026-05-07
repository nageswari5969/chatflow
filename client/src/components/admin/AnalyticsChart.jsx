export default function AnalyticsChart({ title, data = [] }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: 24,
    }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 16 }}>{title}</h3>
      <div style={{
        height: 180, display: 'flex', alignItems: 'flex-end', gap: 8,
        padding: '0 8px',
      }}>
        {data.length > 0 ? data.map((d, i) => {
          const max = Math.max(...data.map(x => x.value || 0), 1)
          const pct = ((d.value || 0) / max) * 100
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: '100%', height: `${pct}%`, minHeight: 4,
                background: 'var(--accent)',
                borderRadius: '4px 4px 0 0',
                opacity: 0.7 + (i / data.length) * 0.3,
                transition: 'height 0.3s ease',
              }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.label}</span>
            </div>
          )
        }) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
            No data available
          </div>
        )}
      </div>
    </div>
  )
}
