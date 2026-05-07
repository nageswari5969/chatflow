export const generateAvatarColor = (name = '') => {
  const colors = [
    '#6c63ff', '#f59e0b', '#22c55e', '#ef4444',
    '#3b82f6', '#ec4899', '#14b8a6', '#f97316',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export const getInitials = (name = '') => {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

export const truncateText = (text = '', max = 40) => {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}

export const classNames = (...classes) => classes.filter(Boolean).join(' ')
