import { format, isToday, isYesterday, formatDistanceToNow, differenceInMinutes } from 'date-fns'

export const formatMessageTime = (date) => {
  const d = new Date(date)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return 'Yesterday'
  return format(d, 'dd/MM/yy')
}

export const formatFullTime = (date) => {
  return format(new Date(date), 'dd MMM yyyy, HH:mm')
}

export const formatRelative = (date) => {
  const d = new Date(date)
  const diff = differenceInMinutes(new Date(), d)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  return formatDistanceToNow(d, { addSuffix: true })
}

export const formatCallDuration = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const groupMessagesByDate = (messages = []) => {
  const groups = {}
  messages.forEach(msg => {
    const d = new Date(msg.createdAt)
    const key = isToday(d) ? 'Today' : isYesterday(d) ? 'Yesterday' : format(d, 'dd MMMM yyyy')
    if (!groups[key]) groups[key] = []
    groups[key].push(msg)
  })
  return groups
}


export const truncateText = (text = '', max = 40) => {
  if (text.length <= max) return text
  return text.slice(0, max) + '…'
}