import { useState, useEffect } from 'react'
import { formatCallDuration } from '../../utils/formatDate'

export default function CallTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <span style={{ fontFamily: 'monospace', fontSize: 15, color: 'var(--text-secondary)' }}>
      {formatCallDuration(seconds)}
    </span>
  )
}
