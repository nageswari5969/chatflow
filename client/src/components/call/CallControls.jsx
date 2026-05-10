

import { useState } from 'react'
import { Mic, MicOff, Video, VideoOff, PhoneOff, Volume2, VolumeX } from 'lucide-react'

export default function CallControls({ onEnd, showVideo = false }) {
  const [muted, setMuted] = useState(false)
  const [videoOff, setVideoOff] = useState(false)
  const [speakerOff, setSpeakerOff] = useState(false)

  const ControlBtn = ({ icon, active, onClick, danger = false }) => (
    <button
      onClick={onClick}
      style={{
        width: 52, height: 52, borderRadius: '50%',
        background: danger ? 'var(--danger)' : active ? 'var(--bg-hover)' : 'rgba(255,255,255,0.1)',
        color: active ? 'var(--danger)' : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all var(--transition)',
        boxShadow: danger ? '0 4px 20px rgba(239,68,68,0.4)' : 'none',
        border: active ? '1px solid var(--danger)' : 'none',
      }}
      onMouseEnter={e => !danger && (e.currentTarget.style.background = 'rgba(255,255,255,0.2)')}
      onMouseLeave={e => !danger && (e.currentTarget.style.background = active ? 'var(--bg-hover)' : 'rgba(255,255,255,0.1)')}
    >
      {icon}
    </button>
  )

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <ControlBtn icon={muted ? <MicOff size={22} /> : <Mic size={22} />} active={muted} onClick={() => setMuted(v => !v)} />
      {showVideo && <ControlBtn icon={videoOff ? <VideoOff size={22} /> : <Video size={22} />} active={videoOff} onClick={() => setVideoOff(v => !v)} />}
      <ControlBtn icon={speakerOff ? <VolumeX size={22} /> : <Volume2 size={22} />} active={speakerOff} onClick={() => setSpeakerOff(v => !v)} />
      <ControlBtn icon={<PhoneOff size={22} />} danger onClick={onEnd} />
    </div>
  )
}
