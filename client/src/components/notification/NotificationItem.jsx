import { Bell, MessageSquare, Users, Phone } from 'lucide-react'
import { formatRelative } from '../../utils/formatDate'

const iconMap = {
  message: <MessageSquare size={14} />,
  group: <Users size={14} />,
  call: <Phone size={14} />,
  default: <Bell size={14} />,
}

export default function NotificationItem({ notification, onRead }) {
  const icon = iconMap[notification.type] || iconMap.default

  return (
    <div
      onClick={() => !notification.read && onRead?.(notification._id)}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 12,
        padding: '12px 16px',
        background: notification.read ? 'transparent' : 'var(--accent-dim)',
        borderBottom: '1px solid var(--border)',
        cursor: notification.read ? 'default' : 'pointer',
        transition: 'background var(--transition)',
      }}
      onMouseEnter={e => { if (!notification.read) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => { if (!notification.read) e.currentTarget.style.background = 'var(--accent-dim)' }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: '50%',
        background: 'var(--bg-elevated)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--accent)', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, fontSize: 13 }}>{notification.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{notification.body}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
          {formatRelative(notification.createdAt)}
        </div>
      </div>
      {!notification.read && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: 4 }} />
      )}
    </div>
  )
}
