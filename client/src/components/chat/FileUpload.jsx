import { useRef } from 'react'
import { Paperclip } from 'lucide-react'

export default function FileUpload({ onUpload }) {
  const inputRef = useRef(null)

  const handleChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // Convert to base64 or call upload service
    const reader = new FileReader()
    reader.onload = () => onUpload?.(file, reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      <button
        onClick={() => inputRef.current?.click()}
        style={{
          color: 'var(--text-muted)',
          display: 'flex', cursor: 'pointer',
          transition: 'color var(--transition)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        title="Attach file"
      >
        <Paperclip size={20} />
      </button>
    </>
  )
}
