import { createContext, useContext, useEffect, useState } from 'react'
import { useSocket } from './SocketContext'
import { getNotifications, markAllRead } from '../services/notificationService'

const NotificationContext = createContext()

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { socket } = useSocket()

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('notification:new', (n) => {
      setNotifications(prev => [n, ...prev])
      setUnreadCount(c => c + 1)
    })
    return () => socket.off('notification:new')
  }, [socket])

  const loadNotifications = async () => {
    try {
      const res = await getNotifications()
      const data = res.data.data || []
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch {}
  }

  const clearAll = async () => {
    await markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, clearAll, loadNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationContext)
