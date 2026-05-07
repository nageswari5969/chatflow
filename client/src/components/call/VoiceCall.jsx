import Avatar from '../common/Avatar'
import CallControls from './CallControls'
import CallTimer from './CallTimer'
import { useCall } from '../../context/CallContext'

export default function VoiceCall({ call }) {
  const { endCall } = useCall()
  const other = call?.otherUser || call?.caller

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: 'linear-gradient(135deg, #0d0f14 0%, #1a1040 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 24,
    }}>
      <div style={{
        position: 'absolute', width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        animation: 'pulse 2s ease infinite',
      }} />

      <Avatar user={other} size="xl" />
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 26 }}>{other?.name}</h2>
        <CallTimer />
      </div>

      <CallControls onEnd={endCall} showVideo={false} />
    </div>
  )
}
