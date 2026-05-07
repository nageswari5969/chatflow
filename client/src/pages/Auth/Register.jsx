import { SignUp } from '@clerk/react'

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        width: 600, height: 600,
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
        bottom: -200, right: -200,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', textAlign: 'center' }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 36, fontWeight: 800,
          marginBottom: 8,
          background: 'linear-gradient(135deg, var(--accent), var(--accent-light))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Join ChatFlow
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 15 }}>
          Create your account to get started
        </p>
        <SignUp
          appearance={{
            variables: {
              colorPrimary: '#6c63ff',
              colorBackground: '#13161d',
              colorInputBackground: '#1a1e28',
              colorText: '#f0f2f8',
              colorTextSecondary: '#9ca3b0',
              colorInputText: '#f0f2f8',
              colorNeutral: '#5c6370',
              borderRadius: '12px',
            },
            elements: {
              card: { boxShadow: '0 8px 40px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.07)' },
            }
          }}
          redirectUrl="/chat"
        />
      </div>
    </div>
  )
}
