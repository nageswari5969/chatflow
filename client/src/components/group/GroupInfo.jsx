import { useState, useEffect } from 'react'
import Avatar from '../common/Avatar'
import Button from '../common/Button'
import { getGroups } from '../../services/groupService'
import { leaveGroup } from '../../services/groupService'
import { LogOut, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

export default function GroupInfo({ group, onLeave }) {
  if (!group) return null

  const handleLeave = async () => {
    try {
      await leaveGroup(group._id)
      toast.success('Left group')
      onLeave?.()
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 'var(--radius-lg)',
          background: 'var(--accent-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--accent)', fontFamily: 'var(--font-display)',
          fontWeight: 800, fontSize: 28, margin: '0 auto 12px',
        }}>
          {group.name[0].toUpperCase()}
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>{group.name}</h3>
        {group.description && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>{group.description}</p>
        )}
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
          {group.memberCount || 0} members
        </p>
      </div>
      <Button variant="danger" size="sm" icon={<LogOut size={14} />} onClick={handleLeave}
        style={{ width: '100%', justifyContent: 'center' }}>
        Leave Group
      </Button>
    </div>
  )
}
