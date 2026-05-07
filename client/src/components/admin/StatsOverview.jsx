export default function StatsOverview({ stats = {} }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} style={{
          background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '14px 16px',
        }}>
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: 'var(--font-display)' }}>{value}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 4 }}>{key}</div>
        </div>
      ))}
    </div>
  )
}
