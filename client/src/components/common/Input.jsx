import { useState } from 'react'

export default function Input({ label, icon, error, style = {}, ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && (
        <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <span style={{
            position: 'absolute', left: 12,
            color: focused ? 'var(--accent)' : 'var(--text-muted)',
            transition: 'color var(--transition)',
            display: 'flex',
          }}>
            {icon}
          </span>
        )}
        <input
          style={{
            width: '100%',
            background: 'var(--bg-tertiary)',
            border: `1px solid ${focused ? 'var(--accent)' : error ? 'var(--danger)' : 'var(--border)'}`,
            borderRadius: 'var(--radius-md)',
            padding: icon ? '10px 12px 10px 38px' : '10px 12px',
            color: 'var(--text-primary)',
            fontSize: 14,
            outline: 'none',
            transition: 'border-color var(--transition)',
            ...style,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>
      {error && <span style={{ fontSize: 12, color: 'var(--danger)' }}>{error}</span>}
    </div>
  )
}
