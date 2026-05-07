import ChatHeader from './ChatHeader'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import EmptyState from '../common/EmptyState'
import { MessageSquare } from 'lucide-react'

export default function ChatWindow({ conversation }) {
  if (!conversation) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <EmptyState
          icon={<MessageSquare size={32} />}
          title="Select a conversation"
          description="Choose from your existing conversations or start a new one"
        />
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
      <ChatHeader conversation={conversation} />
      <MessageList chatId={conversation._id} />
      <MessageInput chatId={conversation._id} />
    </div>
  )
}
