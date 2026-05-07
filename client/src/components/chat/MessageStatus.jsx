import { Check, CheckCheck } from 'lucide-react'

export function MessageStatus({ status }) {
  if (status === 'read') return <CheckCheck size={14} color="var(--accent)" />
  if (status === 'delivered') return <CheckCheck size={14} color="var(--text-muted)" />
  return <Check size={14} color="var(--text-muted)" />
}

export function ReadReceipt({ readBy = [], totalParticipants = 2 }) {
  const readCount = readBy.length
  const allRead = readCount >= totalParticipants
  return (
    <span style={{ fontSize: 11, color: allRead ? 'var(--accent)' : 'var(--text-muted)' }}>
      {allRead ? 'Read by all' : `Read by ${readCount}`}
    </span>
  )
}
