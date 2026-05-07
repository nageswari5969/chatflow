import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'

export default function VerifyEmail() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', maxWidth: 400, width: '100%' }}>
        <Mail size={48} color="var(--accent)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Verify your email</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          Please check your inbox and click the verification link.
        </p>
        <Link to="/sign-in" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>Back to sign in</Link>
      </div>
    </div>
  )
}
