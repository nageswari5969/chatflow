// ForgotPassword.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-primary)',
    }}>
      <div style={{
        width: 400, padding: 32,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)',
      }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, marginBottom: 8 }}>Reset Password</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          Enter your email to receive a reset link
        </p>
        {sent ? (
          <div style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ color: 'var(--success)', fontWeight: 600 }}>Check your email!</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>We sent a reset link to {email}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail size={16} />} placeholder="you@example.com" />
            <Button onClick={() => setSent(true)} style={{ width: '100%', justifyContent: 'center' }}>Send Reset Link</Button>
          </div>
        )}
        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--text-muted)' }}>
          <Link to="/sign-in" style={{ color: 'var(--accent)' }}>Back to sign in</Link>
        </p>
      </div>
    </div>
  )
}
