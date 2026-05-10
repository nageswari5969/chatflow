

import { Phone, PhoneOff, Video } from 'lucide-react'
import { useCall } from '../../context/CallContext'
import Avatar from '../common/Avatar'

export default function IncomingCallModal() {
  const { incomingCall, acceptCall, rejectCall } = useCall()
  if (!incomingCall) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
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
        <div style={{ marginBottom: 20 }}>
          <Avatar user={incomingCall.caller} size="xl" />
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>Incoming {incomingCall.type} call</p>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 32 }}>
          {incomingCall.caller?.name || 'Someone'}
        </h3>

        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <button
            onClick={rejectCall}
            style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--danger)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 24,
              boxShadow: '0 4px 20px rgba(239,68,68,0.4)',
              transition: 'transform var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            <PhoneOff size={24} />
          </button>
          <button
            onClick={acceptCall}
            style={{
              width: 60, height: 60, borderRadius: '50%',
              background: 'var(--success)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(34,197,94,0.4)',
              transition: 'transform var(--transition)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.style.transform = ''}
          >
            {incomingCall.type === 'video' ? <Video size={24} /> : <Phone size={24} />}
          </button>
        </div>
      </div>
    </div>
  )
}
