import { useRef, useEffect } from 'react'
import CallControls from './CallControls'
import CallTimer from './CallTimer'
import { useCall } from '../../context/CallContext'

export default function VideoCall({ call }) {
  const { endCall } = useCall()
  const localRef = useRef(null)
  const remoteRef = useRef(null)

  useEffect(() => {
    // Request camera/mic access
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localRef.current) localRef.current.srcObject = stream
      })
      .catch(() => {})

    return () => {
      if (localRef.current?.srcObject) {
        localRef.current.srcObject.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      background: '#000',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Remote video */}
      <video
        ref={remoteRef}
        autoPlay
        playsInline
        style={{ flex: 1, objectFit: 'cover', width: '100%' }}
      />

      {/* Local video PiP */}
      <video
        ref={localRef}
        autoPlay
        playsInline
        muted
        style={{
          position: 'absolute', bottom: 120, right: 20,
          width: 140, height: 100,
          borderRadius: 'var(--radius-md)',
          objectFit: 'cover',
          border: '2px solid var(--border)',
          boxShadow: 'var(--shadow-md)',
        }}
      />

      {/* Controls bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 12,
        padding: '20px 0 32px',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
      }}>
        <CallTimer />
        <CallControls onEnd={endCall} showVideo />
      </div>
    </div>
  )
}
