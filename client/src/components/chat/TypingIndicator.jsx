export default function TypingIndicator() {
  return (
    <div style={{ padding: '4px 20px', animation: 'fadeIn 0.2s ease' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        background: 'var(--bg-elevated)',
        padding: '10px 16px',
        borderRadius: '18px 18px 18px 4px',
      }}>
        {[0, 1, 2].map(i => (
          <span key={i} style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--text-muted)',
            animation: 'blink 1.2s ease infinite',
            animationDelay: `${i * 0.2}s`,
            display: 'block',
          }} />
        ))}
      </div>
    </div>
  )
}
