import { useState } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import SearchBar from '../common/SearchBar'
import Avatar from '../common/Avatar'
import { searchUsers } from '../../services/userService'
import { createGroup } from '../../services/groupService'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function CreateGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selected, setSelected] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (q) => {
    if (!q) return setSearchResults([])
    try {
      const res = await searchUsers(q)
      setSearchResults(res.data.data || [])
    } catch {}
  }

  const toggleUser = (user) => {
    setSelected(prev =>
      prev.find(u => u._id === user._id)
        ? prev.filter(u => u._id !== user._id)
        : [...prev, user]
    )
  }

  const handleCreate = async () => {
    if (!name.trim() || selected.length < 1) {
      toast.error('Group name and at least 1 member required')
      return
    }
    setLoading(true)
    try {
      await createGroup({ name, description, memberIds: selected.map(u => u._id) })
      toast.success('Group created!')
      onCreated?.()
      onClose()
      setName(''); setDescription(''); setSelected([])
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Group">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input label="Group Name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Project Team" />
        <Input label="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} placeholder="What's this group about?" />

        <div>
          <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            Add Members
          </label>
          {selected.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
              {selected.map(u => (
                <div key={u._id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--accent-dim)', borderRadius: 'var(--radius-full)',
                  padding: '4px 10px 4px 6px', fontSize: 13,
                }}>
                  <Avatar user={u} size="xs" />
                  {u.name}
                  <button onClick={() => toggleUser(u)} style={{ color: 'var(--accent)', display: 'flex', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <SearchBar placeholder="Search users to add..." onSearch={handleSearch} />
          <div style={{ maxHeight: 200, overflowY: 'auto', marginTop: 8 }}>
            {searchResults.map(u => (
              <div
                key={u._id}
                onClick={() => toggleUser(u)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '8px',
                  borderRadius: 'var(--radius-md)', cursor: 'pointer',
                  background: selected.find(s => s._id === u._id) ? 'var(--accent-dim)' : 'transparent',
                  transition: 'background var(--transition)',
                }}
                onMouseEnter={e => { if (!selected.find(s => s._id === u._id)) e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!selected.find(s => s._id === u._id)) e.currentTarget.style.background = '' }}
              >
                <Avatar user={u} size="sm" />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleCreate} loading={loading} style={{ marginTop: 4 }}>
          Create Group
        </Button>
      </div>
    </Modal>
  )
}
