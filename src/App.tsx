import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Tools from './pages/Tools'
import Login from './pages/Login'
import Resources from './pages/Resources'
import ResumeTips from './pages/ResumeTips'
import Admin from './pages/Admin'
import AppShell from './components/AppShell'

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent animate-spin rounded-full"></div>
          <span className="font-mono text-xs text-neutral-400">Loading Session...</span>
        </div>
      </div>
    )
  }

  return user ? <AppShell>{children}</AppShell> : <Navigate to="/login" replace />
}

// Admin Route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent animate-spin rounded-full"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return role === 'admin' ? <AppShell>{children}</AppShell> : <Navigate to="/" replace />
}

export default function App() {
  // Initialize authentication state listener
  useAuth()

  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right"
        toastOptions={{
          className: 'font-display font-semibold text-sm rounded-none border-2 border-neutral-900 bg-neutral-0 text-neutral-950',
          duration: 4000,
          style: {
            boxShadow: 'none',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-brand-positive)',
              secondary: 'var(--color-neutral-0)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-brand-danger)',
              secondary: 'var(--color-neutral-0)',
            },
          }
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/resume-tips" element={<ProtectedRoute><ResumeTips /></ProtectedRoute>} />
        
        {/* Admin Route */}
        <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

        
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
