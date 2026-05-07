import { useState, useEffect } from 'react'
import Sidebar from '../../components/common/Sidebar'
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed } from 'lucide-react'
import { getCallHistory } from '../../services/callService'
import Avatar from '../../components/common/Avatar'
import { formatRelative } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'

export default function CallsPage() {
  const [calls, setCalls] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCallHistory()
      .then(r => setCalls(r.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const CallIcon = ({ type, direction }) => {
    if (type === 'missed') return <PhoneMissed size={16} color="var(--danger)" />
    if (direction === 'incoming') return <PhoneIncoming size={16} color="var(--success)" />
    return <PhoneOutgoing size={16} color="var(--accent)" />
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{
          padding: '24px 32px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
        }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>Calls</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Your call history</p>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 32px' }}>
          {loading ? <Loader /> : calls.length === 0 ? (
            <EmptyState icon={<Phone size={28} />} title="No call history" description="Your calls will appear here" />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {calls.map(call => (
                <div
                  key={call._id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    borderRadius: 'var(--radius-md)',
                    transition: 'background var(--transition)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}
                >
                  <Avatar user={call.otherUser} size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{call.otherUser?.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                      <CallIcon type={call.status} direction={call.direction} />
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {call.status === 'missed' ? 'Missed' : call.direction === 'incoming' ? 'Incoming' : 'Outgoing'} • {formatRelative(call.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'var(--bg-elevated)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-muted)', cursor: 'pointer',
                      transition: 'all var(--transition)',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent)'; e.currentTarget.style.color = '#fff' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-elevated)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                    >
                      {call.type === 'video' ? <Video size={16} /> : <Phone size={16} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
