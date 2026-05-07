import { createContext, useContext, useEffect, useState } from 'react'
import { useSocket } from './SocketContext'
import { EVENTS } from '../utils/constants'

const CallContext = createContext()

export function CallProvider({ children }) {
  const [incomingCall, setIncomingCall] = useState(null)
  const [activeCall, setActiveCall] = useState(null)
  const { socket } = useSocket()

  useEffect(() => {
    if (!socket) return

    socket.on(EVENTS.CALL_INCOMING, (call) => setIncomingCall(call))
    socket.on(EVENTS.CALL_END, () => { setActiveCall(null); setIncomingCall(null) })

    return () => {
      socket.off(EVENTS.CALL_INCOMING)
      socket.off(EVENTS.CALL_END)
    }
  }, [socket])

  const acceptCall = () => {
    if (!incomingCall) return
    socket?.emit(EVENTS.CALL_ACCEPT, { callId: incomingCall._id })
    setActiveCall(incomingCall)
    setIncomingCall(null)
  }

  const rejectCall = () => {
    if (!incomingCall) return
    socket?.emit(EVENTS.CALL_REJECT, { callId: incomingCall._id })
    setIncomingCall(null)
  }

  const initiateCall = (userId, type) => {
    socket?.emit('call:start', { userId, type })
    setActiveCall({ userId, type, outgoing: true })
  }

  const endCall = () => {
    if (activeCall) socket?.emit(EVENTS.CALL_END, { callId: activeCall._id })
    setActiveCall(null)
  }

  return (
    <CallContext.Provider value={{ incomingCall, activeCall, acceptCall, rejectCall, initiateCall, endCall }}>
      {children}
    </CallContext.Provider>
  )
}

export const useCall = () => useContext(CallContext)
