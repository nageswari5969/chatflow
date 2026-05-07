import { useState } from 'react'
import Modal from '../common/Modal'
import SearchBar from '../common/SearchBar'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import { searchUsers } from '../../services/userService'
import { addMembers } from '../../services/groupService'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddMembersModal({ open, onClose, groupId, onAdded }) {
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (q) => {
    if (!q) return setResults([])
    const res = await searchUsers(q)
    setResults(res.data.data || [])
  }

  const toggle = (user) => {
    setSelected(p => p.find(u => u._id === user._id) ? p.filter(u => u._id !== user._id) : [...p, user])
  }

  const handleAdd = async () => {
    if (!selected.length) return
    setLoading(true)
    try {
      await addMembers(groupId, selected.map(u => u._id))
      toast.success('Members added!')
      onAdded?.()
      onClose()
      setSelected([])
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Members">
      {selected.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          {selected.map(u => (
            <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--accent-dim)', borderRadius: 'var(--radius-full)', padding: '4px 10px 4px 6px', fontSize: 13 }}>
              <Avatar user={u} size="xs" />
              {u.name}
              <button onClick={() => toggle(u)} style={{ color: 'var(--accent)', display: 'flex', cursor: 'pointer' }}><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
      <SearchBar placeholder="Search users..." onSearch={handleSearch} />
      <div style={{ maxHeight: 240, overflowY: 'auto', margin: '12px 0' }}>
        {results.map(u => (
          <div key={u._id} onClick={() => toggle(u)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px', borderRadius: 'var(--radius-md)', cursor: 'pointer', background: selected.find(s => s._id === u._id) ? 'var(--accent-dim)' : 'transparent' }}
            onMouseEnter={e => { if (!selected.find(s => s._id === u._id)) e.currentTarget.style.background = 'var(--bg-hover)' }}
            onMouseLeave={e => { if (!selected.find(s => s._id === u._id)) e.currentTarget.style.background = '' }}>
            <Avatar user={u} size="sm" />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{u.email}</div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={handleAdd} loading={loading} style={{ width: '100%', justifyContent: 'center' }}>
        Add {selected.length > 0 ? `${selected.length} ` : ''}Members
      </Button>
    </Modal>
  )
}
