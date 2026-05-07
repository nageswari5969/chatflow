import { useEffect, useRef } from 'react'
import { useChat } from '../../context/ChatContext'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import Loader from '../common/Loader'
import { groupMessagesByDate } from '../../utils/formatDate'
import { deleteMessage } from '../../services/chatService'

export default function MessageList({ chatId }) {
  const { messages, typingUsers, loading } = useChat()
  const bottomRef = useRef(null)
  const msgs = messages[chatId] || []
  const isTyping = typingUsers[chatId]?.length > 0
  const grouped = groupMessagesByDate(msgs)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, isTyping])

  const handleDelete = async (messageId) => {
    try { await deleteMessage(chatId, messageId) } catch {}
  }

  if (loading) return <Loader />

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {Object.entries(grouped).map(([date, dayMsgs]) => (
        <div key={date}>
          <div style={{
            textAlign: 'center', padding: '8px 0',
            fontSize: 12, color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: 12, margin: '0 20px',
          }}>
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            {date}
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          {dayMsgs.map(msg => (
            <MessageBubble key={msg._id} message={msg} onDelete={handleDelete} />
          ))}
        </div>
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}
