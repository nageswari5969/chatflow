import { useState } from 'react'
import { Check, CheckCheck, Trash2 } from 'lucide-react'
import { useUser } from '@clerk/react'

export default function MessageBubble({ message, onDelete }) {
  const { user } = useUser()
  const [hovered, setHovered] = useState(false)

  // Fix: Compare clerk ID with sender's clerkId
  const myClerkId = user?.id
  const senderClerkId = message.sender?.clerkId || message.sender?._id || message.sender
  const isMine = myClerkId && (
    myClerkId === senderClerkId ||
    myClerkId === message.senderId ||
    user?.id === message.sender?.clerkId
  )

  const StatusIcon = () => {
    if (!isMine) return null
    if (message.status === 'read') return <CheckCheck size={14} color="var(--accent)" />
    if (message.status === 'delivered') return <CheckCheck size={14} color="var(--text-muted)" />
    return <Check size={14} color="var(--text-muted)" />
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMine ? 'row-reverse' : 'row',
        gap: 8,
        padding: '2px 20px',
        animation: 'fadeIn 0.2s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        maxWidth: '68%',
        padding: '10px 14px',
        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isMine ? 'var(--accent)' : 'var(--bg-elevated)',
        color: isMine ? '#fff' : 'var(--text-primary)',
        fontSize: 14,
        lineHeight: 1.5,
        boxShadow: isMine ? 'var(--shadow-accent)' : 'var(--shadow-sm)',
      }}>
        {message.type === 'image' ? (
          <img src={message.content} alt="img" style={{ maxWidth: 240, borderRadius: 8, display: 'block' }} />
        ) : (
          <span style={{ wordBreak: 'break-word' }}>{message.content}</span>
        )}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 4, marginTop: 4,
        }}>
          <span style={{ fontSize: 11, opacity: 0.7 }}>
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <StatusIcon />
        </div>
      </div>

      {hovered && isMine && (
        <button
          onClick={() => onDelete?.(message._id)}
          style={{
            color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', padding: 4,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer', alignSelf: 'center',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  )
}