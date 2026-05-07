export default function EmptyState({ icon, title, description, action }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, padding: 40, textAlign: 'center', height: '100%',
    }}>
      {icon && (
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--text-muted)', fontSize: 28,
        }}>
          {icon}
        </div>
      )}
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--text-secondary)' }}>
        {title}
      </h3>
      {description && (
        <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 280 }}>{description}</p>
      )}
      {action}
    </div>
  )
}
