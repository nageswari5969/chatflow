import { Phone, PhoneOff, Video } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import Avatar from '../common/Avatar'

export default function OutgoingCallModal() {
  const { activeCall, endCall } = useCall()
  if (!activeCall?.outgoing) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '40px 48px',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease',
        minWidth: 280,
      }}>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Calling...
        </p>
        <Avatar user={activeCall.otherUser} size="xl" />
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, margin: '16px 0 32px' }}>
          {activeCall.otherUser?.name || 'User'}
        </h3>
        <button
          onClick={endCall}
          style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--danger)', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
          }}
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  )
}
