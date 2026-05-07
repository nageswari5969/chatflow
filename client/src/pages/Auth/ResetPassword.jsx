import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ textAlign: 'center', padding: 40, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', maxWidth: 400, width: '100%' }}>
        <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 16 }} />
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 8 }}>Password Reset</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24 }}>
          This feature is handled by Clerk. Use the email link provided.
        </p>
        <Link to="/sign-in" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 14 }}>Back to sign in</Link>
      </div>
    </div>
  )
}
