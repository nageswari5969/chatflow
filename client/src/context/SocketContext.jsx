import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useAuth } from '@clerk/react'
import { initSocket, disconnectSocket } from '../utils/socket'

const SocketContext = createContext()

export function SocketProvider({ children }) {
  const { getToken } = useAuth()
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    let mounted = true

    const connect = async () => {
      const token = await getToken()
      if (!token || !mounted) return
      window.__clerk_token = token

      // Auto sync Clerk user to MongoDB
      try {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        })
      } catch (e) {
        console.log('Sync error:', e)
      }

      const socket = initSocket(token)
      socketRef.current = socket

      socket.on('connect', () => mounted && setConnected(true))
      socket.on('disconnect', () => mounted && setConnected(false))
    }

    connect()

    return () => {
      mounted = false
      disconnectSocket()
    }
  }, [getToken])

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)