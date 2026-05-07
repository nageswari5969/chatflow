import { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'
import { updateGroup } from '../../services/groupService'
import toast from 'react-hot-toast'

export default function GroupSettings({ group, onUpdated }) {
  const [name, setName] = useState(group?.name || '')
  const [description, setDescription] = useState(group?.description || '')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      await updateGroup(group._id, { name, description })
      toast.success('Group updated!')
      onUpdated?.()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <h4 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Group Settings
      </h4>
      <Input label="Group Name" value={name} onChange={e => setName(e.target.value)} />
      <Input label="Description" value={description} onChange={e => setDescription(e.target.value)} />
      <Button onClick={handleSave} loading={loading}>Save Changes</Button>
    </div>
  )
}
