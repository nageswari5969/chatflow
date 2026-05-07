import { useState, useEffect } from 'react'
import { Plus, Users } from 'lucide-react'
import { getGroups } from '../../services/groupService'
import Avatar from '../common/Avatar'
import SearchBar from '../common/SearchBar'
import Loader from '../common/Loader'
import EmptyState from '../common/EmptyState'
import CreateGroupModal from './CreateGroupModal'
import { formatMessageTime } from '../../utils/formatDate'

export default function GroupList({ activeGroup, onSelect }) {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    setLoading(true)
    try {
      const res = await getGroups()
      setGroups(res.data.data || [])
    } catch {}
    finally { setLoading(false) }
  }

  const filtered = groups.filter(g => g.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800 }}>Groups</h2>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'var(--accent-dim)', color: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Plus size={18} />
          </button>
        </div>
        <SearchBar placeholder="Search groups..." onSearch={setQuery} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? <Loader /> : filtered.length === 0 ? (
          <EmptyState icon={<Users size={28} />} title="No groups" description="Create a group to start messaging" />
        ) : filtered.map(g => (
          <div
            key={g._id}
            onClick={() => onSelect(g)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
              cursor: 'pointer',
              background: activeGroup?._id === g._id ? 'var(--bg-tertiary)' : 'transparent',
              borderLeft: activeGroup?._id === g._id ? '3px solid var(--accent)' : '3px solid transparent',
              transition: 'all var(--transition)',
            }}
            onMouseEnter={e => { if (activeGroup?._id !== g._id) e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => { if (activeGroup?._id !== g._id) e.currentTarget.style.background = '' }}
          >
            <div style={{
              width: 44, height: 44, borderRadius: 'var(--radius-md)',
              background: 'var(--accent-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
              flexShrink: 0,
            }}>
              {g.name[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{g.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.members?.length || 0} members</div>
            </div>
          </div>
        ))}
      </div>

      <CreateGroupModal open={showCreate} onClose={() => setShowCreate(false)} onCreated={loadGroups} />
    </div>
  )
}
