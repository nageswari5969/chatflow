import { Phone, Video, Info, MoreVertical } from 'lucide-react'
import Avatar from '../common/Avatar'
import { useCall } from '../../context/CallContext'

export default function ChatHeader({ conversation }) {
  const { initiateCall } = useCall()
  const other = conversation?.otherUser

  if (!conversation) return null

  return (
    <div style={{
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Avatar user={other} size="sm" online={other?.online} />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, fontFamily: 'var(--font-display)' }}>
            {other?.name || 'User'}
          </div>
          <div style={{ fontSize: 12, color: other?.online ? 'var(--online)' : 'var(--text-muted)' }}>
            {other?.online ? 'Online' : 'Offline'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {[
          { icon: <Phone size={18} />, label: 'Voice call', onClick: () => initiateCall(other?._id, 'voice') },
          { icon: <Video size={18} />, label: 'Video call', onClick: () => initiateCall(other?._id, 'video') },
          { icon: <Info size={18} />, label: 'Info' },
        ].map(({ icon, label, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            title={label}
            style={{
              width: 36, height: 36,
              borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-muted)',
              transition: 'all var(--transition)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  )
}
