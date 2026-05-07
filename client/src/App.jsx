import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth, useUser } from '@clerk/react'

import { SocketProvider } from './context/SocketContext'
import { ChatProvider } from './context/ChatContext'
import { NotificationProvider } from './context/NotificationContext'
import { CallProvider } from './context/CallContext'
import { ThemeProvider } from './context/ThemeContext'

import ChatPage from './pages/Chat/ChatPage'
import GroupsPage from './pages/Groups/GroupsPage'
import CallsPage from './pages/Calls/CallsPage'
import SettingsPage from './pages/Settings/SettingsPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import UserManagement from './pages/Admin/UserManagement'
import ReportsManagement from './pages/Admin/ReportsManagement'
import LoginPage from './pages/Auth/Login'
import RegisterPage from './pages/Auth/Register'
import Loader from './components/common/Loader'

function ProtectedLayout({ children, adminOnly = false }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  if (!isLoaded) return <Loader />
  if (!isSignedIn) {
    window.location.href = '/sign-in'
    return null
  }

  // Admin check
  if (adminOnly) {
    const isAdmin = user?.publicMetadata?.role === 'admin' ||
                    user?.emailAddresses?.[0]?.emailAddress === 'nageswari5969@gmail.com'
    if (!isAdmin) {
      return (
        <div style={{
          height: '100vh', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16,
          background: 'var(--bg-primary)',
        }}>
          <div style={{ fontSize: 48 }}>🚫</div>
          <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Access Denied
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Admin access only
          </p>
          <a href="/chat" style={{ color: 'var(--accent)' }}>← Back to Chat</a>
        </div>
      )
    }
  }

  return (
    <SocketProvider>
      <NotificationProvider>
        <CallProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </CallProvider>
      </NotificationProvider>
    </SocketProvider>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1e28',
              color: '#f0f2f8',
              border: '1px solid rgba(255,255,255,0.07)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0d0f14' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0d0f14' } },
          }}
        />
        <Routes>
  <Route path="/" element={<Navigate to="/chat" replace />} />
  <Route path="/sign-in/*" element={<LoginPage />} />
  <Route path="/sign-up/*" element={<RegisterPage />} />
  <Route path="/chat" element={<ProtectedLayout><ChatPage /></ProtectedLayout>} />
  <Route path="/groups" element={<ProtectedLayout><GroupsPage /></ProtectedLayout>} />
  <Route path="/calls" element={<ProtectedLayout><CallsPage /></ProtectedLayout>} />
  <Route path="/settings" element={<ProtectedLayout><SettingsPage /></ProtectedLayout>} />
  <Route path="/admin" element={<ProtectedLayout adminOnly><AdminDashboard /></ProtectedLayout>} />
  <Route path="/admin/users" element={<ProtectedLayout adminOnly><UserManagement /></ProtectedLayout>} />
  <Route path="/admin/reports" element={<ProtectedLayout adminOnly><ReportsManagement /></ProtectedLayout>} />
</Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
