import { clsx } from 'clsx'

const variants = {
  primary: {
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
  },
  secondary: {
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: 'none',
  },
  danger: {
    background: 'var(--danger)',
    color: '#fff',
    border: 'none',
  },
}

export default function Button({ children, variant = 'primary', size = 'md', icon, loading, style = {}, ...props }) {
  const v = variants[variant] || variants.primary
  const padding = size === 'sm' ? '6px 12px' : size === 'lg' ? '12px 24px' : '8px 16px'
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 16 : 14

  return (
    <button
      style={{
        ...v,
        padding,
        fontSize,
        fontWeight: 500,
        borderRadius: 'var(--radius-md)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        cursor: props.disabled || loading ? 'not-allowed' : 'pointer',
        opacity: props.disabled || loading ? 0.6 : 1,
        transition: 'all var(--transition)',
        whiteSpace: 'nowrap',
        ...style,
      }}
      onMouseEnter={e => { if (!props.disabled) e.currentTarget.style.filter = 'brightness(1.12)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = '' }}
      {...props}
    >
      {loading ? (
        <span style={{
          width: 14, height: 14,
          border: '2px solid currentColor',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
          display: 'inline-block',
        }} />
      ) : icon}
      {children}
    </button>
  )
}
