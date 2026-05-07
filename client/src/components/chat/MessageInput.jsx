import { useState, useRef, useCallback } from 'react'
import { Send, Smile, Paperclip, X } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import { useChat } from '../../context/ChatContext'
import { useSocket } from '../../context/SocketContext'
import { EVENTS } from '../../utils/constants'

export default function MessageInput({ chatId }) {
  const [text, setText] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)
  const [sending, setSending] = useState(false)
  const { sendMsg } = useChat()
  const { socket } = useSocket()
  const typingTimer = useRef(null)
  const isTypingRef = useRef(false)

  const handleTyping = () => {
    if (!isTypingRef.current) {
      isTypingRef.current = true
      socket?.emit(EVENTS.TYPING_START, { chatId })
    }
    clearTimeout(typingTimer.current)
    typingTimer.current = setTimeout(() => {
      isTypingRef.current = false
      socket?.emit(EVENTS.TYPING_STOP, { chatId })
    }, 1500)
  }

  const handleSend = useCallback(async () => {
    if (!text.trim() || sending) return
    setSending(true)
    clearTimeout(typingTimer.current)
    socket?.emit(EVENTS.TYPING_STOP, { chatId })
    isTypingRef.current = false
    const content = text.trim()
    setText('')
    try {
      await sendMsg(chatId, content)
    } finally {
      setSending(false)
    }
  }, [text, sending, chatId, sendMsg, socket])

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleEmoji = (emojiData) => {
    setText(t => t + emojiData.emoji)
    setShowEmoji(false)
  }

  return (
    <div style={{
      padding: '12px 16px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-secondary)',
      flexShrink: 0,
      position: 'relative',
    }}>
      {showEmoji && (
        <div style={{ position: 'absolute', bottom: '100%', left: 16, zIndex: 100 }}>
          <EmojiPicker
            onEmojiClick={handleEmoji}
            theme="dark"
            skinTonesDisabled
            searchDisabled={false}
            width={320}
            height={380}
          />
        </div>
      )}

      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 8,
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '8px 8px 8px 14px',
        transition: 'border-color var(--transition)',
      }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        <button
          onClick={() => setShowEmoji(v => !v)}
          style={{
            color: showEmoji ? 'var(--accent)' : 'var(--text-muted)',
            display: 'flex', cursor: 'pointer',
            transition: 'color var(--transition)',
            flexShrink: 0,
          }}
        >
          {showEmoji ? <X size={20} /> : <Smile size={20} />}
        </button>

        <textarea
          value={text}
          onChange={e => { setText(e.target.value); handleTyping() }}
          onKeyDown={handleKey}
          placeholder="Type a message..."
          rows={1}
          style={{
            flex: 1, background: 'none', border: 'none', outline: 'none',
            color: 'var(--text-primary)', fontSize: 14,
            resize: 'none', maxHeight: 120, lineHeight: 1.5,
            overflowY: 'auto',
          }}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: text.trim() ? 'var(--accent)' : 'var(--bg-hover)',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: text.trim() ? 'pointer' : 'default',
            transition: 'all var(--transition)',
            flexShrink: 0,
            boxShadow: text.trim() ? 'var(--shadow-accent)' : 'none',
          }}
        >
          {sending ? (
            <span style={{
              width: 14, height: 14,
              border: '2px solid rgba(255,255,255,0.4)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
              display: 'block',
            }} />
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>
    </div>
  )
}
