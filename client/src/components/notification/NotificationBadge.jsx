export default function NotificationBadge({ count }) {
  if (!count) return null
  return (
    <span style={{
      position: 'absolute', top: -4, right: -4,
      minWidth: 18, height: 18,
      background: 'var(--danger)',
      color: '#fff',
      fontSize: 11, fontWeight: 700,
      borderRadius: 'var(--radius-full)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 4px',
      border: '2px solid var(--bg-primary)',
      lineHeight: 1,
    }}>
      {count > 99 ? '99+' : count}
    </span>
  )
}
