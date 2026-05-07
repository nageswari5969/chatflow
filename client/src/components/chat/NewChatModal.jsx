import { useState } from 'react'
import Modal from '../common/Modal'
import SearchBar from '../common/SearchBar'
import Avatar from '../common/Avatar'
import { searchUsers } from '../../services/userService'
import { createConversation } from '../../services/chatService'
import { useChat } from '../../context/ChatContext'
import Loader from '../common/Loader'

export default function NewChatModal({ open, onClose }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const { loadConversations, setActiveChat } = useChat()

  const handleSearch = async (q) => {
    if (!q.trim()) { setUsers([]); return }
    setLoading(true)
    try {
      const res = await searchUsers(q)
      setUsers(res.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const startChat = async (user) => {
    try {
      const res = await createConversation(user._id)
      await loadConversations()
      setActiveChat(res.data.data)
      onClose()
    } catch {}
  }

  return (
    <Modal open={open} onClose={onClose} title="New Message">
      <SearchBar placeholder="Search users..." onSearch={handleSearch} />
      <div style={{ marginTop: 16, maxHeight: 320, overflowY: 'auto' }}>
        {loading ? <Loader size={20} /> : users.map(user => (
          <div
            key={user._id}
            onClick={() => startChat(user)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 8px', borderRadius: 'var(--radius-md)',
              cursor: 'pointer', transition: 'background var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = ''}
          >
            <Avatar user={user} size="sm" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{user.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user.email}</div>
            </div>
          </div>
        ))}
        {!loading && users.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
            Search for users to start chatting
          </p>
        )}
      </div>
    </Modal>
  )
}
