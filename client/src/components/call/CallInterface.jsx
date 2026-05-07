import { useCall } from '../../context/CallContext'
import VoiceCall from './VoiceCall'
import VideoCall from './VideoCall'

export default function CallInterface() {
  const { activeCall } = useCall()
  if (!activeCall) return null
  return activeCall.type === 'video'
    ? <VideoCall call={activeCall} />
    : <VoiceCall call={activeCall} />
}
