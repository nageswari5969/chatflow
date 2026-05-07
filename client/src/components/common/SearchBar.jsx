import { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ placeholder = 'Search...', onSearch, style = {} }) {
  const [value, setValue] = useState('')

  const handleChange = (e) => {
    setValue(e.target.value)
    onSearch?.(e.target.value)
  }

  const clear = () => {
    setValue('')
    onSearch?.('')
  }

  return (
    <div style={{ position: 'relative', ...style }}>
      <Search size={15} style={{
        position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
        color: 'var(--text-muted)', pointerEvents: 'none',
      }} />
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-full)',
          padding: '8px 36px 8px 36px',
          color: 'var(--text-primary)',
          fontSize: 13,
          outline: 'none',
          transition: 'border-color var(--transition)',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border)'}
      />
      {value && (
        <button onClick={clear} style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          color: 'var(--text-muted)', display: 'flex', cursor: 'pointer',
        }}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}
