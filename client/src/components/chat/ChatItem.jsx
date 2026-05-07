import Avatar from '../common/Avatar'
import { formatMessageTime } from '../../utils/formatDate'
import { truncateText } from '../../utils/helpers'
import { useChat } from '../../context/ChatContext'


export default function ChatItem({ conversation, active, onClick }) {
  const { typingUsers } = useChat()
  const other = conversation.otherUser
  const lastMsg = conversation.lastMessage
  const unread = conversation.unreadCount || 0
  const isTyping = typingUsers[conversation._id]?.length > 0

  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 16px',
        cursor: 'pointer',
        background: active ? 'var(--bg-tertiary)' : 'transparent',
        borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
        transition: 'all var(--transition)',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <Avatar user={other} size="md" online={other?.online} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
            {other?.name || 'Unknown'}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {lastMsg ? formatMessageTime(lastMsg.createdAt) : ''}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
          <span style={{
            fontSize: 13,
            color: isTyping ? 'var(--accent)' : 'var(--text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 170,
            fontStyle: isTyping ? 'italic' : 'normal',
          }}>
            {isTyping ? 'typing...' : (lastMsg?.content || 'No messages yet')}
          </span>
          {unread > 0 && (
            <span style={{
              background: 'var(--accent)',
              color: '#fff', fontSize: 11, fontWeight: 700,
              borderRadius: 'var(--radius-full)',
              padding: '1px 6px', minWidth: 20, textAlign: 'center',
            }}>
              {unread}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
