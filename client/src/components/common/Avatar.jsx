import { generateAvatarColor, getInitials } from '../../utils/helpers'

const sizeMap = {
  xs: { size: 28, font: 11 },
  sm: { size: 36, font: 13 },
  md: { size: 44, font: 15 },
  lg: { size: 56, font: 18 },
  xl: { size: 72, font: 24 },
}

export default function Avatar({ user, size = 'md', online, className = '' }) {
  const { size: px, font } = sizeMap[size] || sizeMap.md
  const name = user?.name || user?.firstName || 'User'
  const color = generateAvatarColor(name)
  const initials = getInitials(name)

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }} className={className}>
      {user?.imageUrl ? (
        <img
          src={user.imageUrl}
          alt={name}
          style={{
            width: px, height: px,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--border)',
          }}
        />
      ) : (
        <div style={{
          width: px, height: px,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: font,
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'var(--font-display)',
          flexShrink: 0,
          border: '2px solid var(--border)',
        }}>
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span style={{
          position: 'absolute',
          bottom: 1, right: 1,
          width: px * 0.26,
          height: px * 0.26,
          borderRadius: '50%',
          background: online ? 'var(--online)' : 'var(--offline)',
          border: '2px solid var(--bg-primary)',
        }} />
      )}
    </div>
  )
}
