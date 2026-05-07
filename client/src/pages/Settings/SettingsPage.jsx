import { UserProfile } from '@clerk/react'
import Sidebar from '../../components/common/Sidebar'

export default function SettingsPage() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)', overflow: 'hidden' }}>
        <div style={{ padding: '24px 32px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>Settings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>Manage your account and preferences</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 32 }}>
          <UserProfile
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
                card: { boxShadow: 'none', border: '1px solid rgba(255,255,255,0.07)' },
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
