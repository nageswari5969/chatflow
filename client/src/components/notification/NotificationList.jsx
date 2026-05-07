import { useNotifications } from '../../context/NotificationContext'
import NotificationItem from './NotificationItem'
import { markNotificationRead } from '../../services/notificationService'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import { Bell } from 'lucide-react'

export default function NotificationList({ onClose }) {
  const { notifications, clearAll, loadNotifications } = useNotifications()

  const handleRead = async (id) => {
    await markNotificationRead(id)
    loadNotifications()
  }

  return (
    <div style={{
      width: 340,
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      overflow: 'hidden',
      maxHeight: 500,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
      }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>Notifications</h3>
        {notifications.some(n => !n.read) && (
          <Button variant="ghost" size="sm" onClick={clearAll} style={{ fontSize: 12, padding: '4px 8px' }}>
            Mark all read
          </Button>
        )}
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <EmptyState icon={<Bell size={24} />} title="All caught up!" description="No new notifications" />
        ) : (
          notifications.map(n => (
            <NotificationItem key={n._id} notification={n} onRead={handleRead} />
          ))
        )}
      </div>
    </div>
  )
}
