import { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { useSocket } from './SocketContext'
import { getConversations, getMessages, sendMessage, markRead } from '../services/chatService'
import { EVENTS } from '../utils/constants'
import toast from 'react-hot-toast'

const ChatContext = createContext()

const initialState = {
  conversations: [],
  activeChat: null,
  messages: {},
  loading: false,
  typingUsers: {},
}

function chatReducer(state, action) {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload }
    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChat: action.payload }
    case 'SET_MESSAGES':
      return { ...state, messages: { ...state.messages, [action.chatId]: action.payload } }
    case 'ADD_MESSAGE': {
      const chatId = action.chatId
      const existing = state.messages[chatId] || []
      const updated = [...existing, action.message]
      // Update conversation last message
      const convs = state.conversations.map(c =>
        c._id === chatId ? { ...c, lastMessage: action.message } : c
      )
      return { ...state, messages: { ...state.messages, [chatId]: updated }, conversations: convs }
    }
    case 'SET_TYPING':
      return {
        ...state,
        typingUsers: {
          ...state.typingUsers,
          [action.chatId]: action.isTyping
            ? [...(state.typingUsers[action.chatId] || []), action.userId].filter((v, i, a) => a.indexOf(v) === i)
            : (state.typingUsers[action.chatId] || []).filter(u => u !== action.userId)
        }
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export function ChatProvider({ children }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)
  const { socket } = useSocket()

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on(EVENTS.MESSAGE_RECEIVE, ({ chatId, message }) => {
      dispatch({ type: 'ADD_MESSAGE', chatId, message })
    })

    socket.on(EVENTS.TYPING_START, ({ chatId, userId }) => {
      dispatch({ type: 'SET_TYPING', chatId, userId, isTyping: true })
    })

    socket.on(EVENTS.TYPING_STOP, ({ chatId, userId }) => {
      dispatch({ type: 'SET_TYPING', chatId, userId, isTyping: false })
    })

    return () => {
      socket.off(EVENTS.MESSAGE_RECEIVE)
      socket.off(EVENTS.TYPING_START)
      socket.off(EVENTS.TYPING_STOP)
    }
  }, [socket])

  const loadConversations = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await getConversations()
      dispatch({ type: 'SET_CONVERSATIONS', payload: res.data.data || [] })
    } catch (e) {
      // silent
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const loadMessages = useCallback(async (chatId) => {
    try {
      const res = await getMessages(chatId)
      dispatch({ type: 'SET_MESSAGES', chatId, payload: res.data.data || [] })
      await markRead(chatId)
    } catch (e) {
      toast.error('Failed to load messages')
    }
  }, [])

  const sendMsg = useCallback(async (chatId, content, type = 'text') => {
    try {
      const res = await sendMessage(chatId, { content, type })
      dispatch({ type: 'ADD_MESSAGE', chatId, message: res.data.data })
    } catch (e) {
      toast.error('Failed to send message')
    }
  }, [])

  const setActiveChat = useCallback((chat) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chat })
    if (chat) loadMessages(chat._id)
  }, [loadMessages])

  return (
    <ChatContext.Provider value={{ ...state, loadConversations, loadMessages, sendMsg, setActiveChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => useContext(ChatContext)
