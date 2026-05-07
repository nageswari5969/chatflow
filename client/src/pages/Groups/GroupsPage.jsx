import { useState } from 'react'
import Sidebar from '../../components/common/Sidebar'
import GroupList from '../../components/group/GroupList'
import EmptyState from '../../components/common/EmptyState'
import { Users, MessageSquare, Hash } from 'lucide-react'
import MessageList from '../../components/chat/MessageList'
import MessageInput from '../../components/chat/MessageInput'

export default function GroupsPage() {
  const [activeGroup, setActiveGroup] = useState(null)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <GroupList activeGroup={activeGroup} onSelect={setActiveGroup} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        {activeGroup ? (
          <>
            {/* Group header */}
            <div style={{
              height: 64, display: 'flex', alignItems: 'center', gap: 14,
              padding: '0 20px', borderBottom: '1px solid var(--border)',
              background: 'var(--bg-secondary)', flexShrink: 0,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                background: 'var(--accent-dim)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18,
              }}>
                {activeGroup.name[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-display)' }}>{activeGroup.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {activeGroup.members?.length || 0} members
                </div>
              </div>
            </div>
            <MessageList chatId={activeGroup._id} />
            <MessageInput chatId={activeGroup._id} />
          </>
        ) : (
          <EmptyState
            icon={<Hash size={32} />}
            title="Select a group"
            description="Choose a group from the sidebar or create a new one"
          />
        )}
      </div>
    </div>
  )
}
