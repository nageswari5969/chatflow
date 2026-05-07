import { useState } from 'react'
import { Edit, Plus } from 'lucide-react'
import { useChat } from '../../context/ChatContext'
import SearchBar from '../common/SearchBar'
import ChatItem from './ChatItem'
import Loader from '../common/Loader'
import EmptyState from '../common/EmptyState'
import NewChatModal from './NewChatModal'

export default function ChatList() {
  const { conversations, loading, activeChat, setActiveChat } = useChat()
  const [query, setQuery] = useState('')
  const [showNewChat, setShowNewChat] = useState(false)

  const filtered = conversations.filter(c => {
    const name = c.otherUser?.name || c.name || ''
    return name.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 16px 12px',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>Messages</h2>
          <button
            onClick={() => setShowNewChat(true)}
            style={{
              width: 36, height: 36,
              borderRadius: 'var(--radius-md)',
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--accent)' && (e.currentTarget.style.color = '#fff')}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-dim)'; e.currentTarget.style.color = 'var(--accent)' }}
          >
            <Edit size={16} />
          </button>
        </div>
        <SearchBar placeholder="Search conversations..." onSearch={setQuery} />
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Edit size={28} />}
            title="No conversations"
            description="Start a new chat to connect with someone"
          />
        ) : (
          filtered.map(conv => (
            <ChatItem
              key={conv._id}
              conversation={conv}
              active={activeChat?._id === conv._id}
              onClick={() => setActiveChat(conv)}
            />
          ))
        )}
      </div>

      <NewChatModal open={showNewChat} onClose={() => setShowNewChat(false)} />
    </div>
  )
}
