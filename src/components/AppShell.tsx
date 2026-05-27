import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { 
  Home, 
  BookOpen, 
  Terminal, 
  FileText, 
  ShieldAlert, 
  LogOut, 
  Menu, 
  X
} from 'lucide-react'

interface AppShellProps {
  children: React.ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const { user, role, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Tools', path: '/tools', icon: Terminal },
    { name: 'Resources', path: '/resources', icon: BookOpen },
    { name: 'Resume Tips', path: '/resume-tips', icon: FileText },
  ]

  // Add Admin link if user is admin
  if (role === 'admin') {
    navItems.push({ name: 'Admin', path: '/admin', icon: ShieldAlert })
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-600 font-body">
      {/* Top Bar */}
      <header className="h-[52px] bg-neutral-0 border-b-[0.5px] border-neutral-200 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 hover:bg-neutral-100 rounded-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand-navy flex items-center justify-center rounded-[6px] text-neutral-0 font-mono font-bold text-sm shrink-0">
              {`>_`}
            </div>
            <span className="font-display font-bold text-[15px] text-brand-navy tracking-tight">ProdHub</span>
            <span className="text-[8px] font-mono uppercase border border-brand-punch text-brand-punch px-1 py-0.5 rounded-none font-bold tracking-wider leading-none">
              FELLOWSHIP
            </span>
          </Link>
        </div>

        {/* User Info & Sign Out */}
        <div className={`flex items-center gap-4 transition-all duration-base ${isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-semibold text-neutral-900">{user?.user_metadata?.full_name || 'Guest User'}</span>
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{role || 'user'}</span>
          </div>
          {user?.user_metadata?.avatar_url && !avatarError ? (
            <img 
              src={user.user_metadata.avatar_url} 
              alt="Avatar" 
              onError={() => setAvatarError(true)}
              className="w-[30px] h-[30px] rounded-full border-[0.5px] border-neutral-200"
            />
          ) : (
            <div className="w-[30px] h-[30px] rounded-full bg-brand-navy flex items-center justify-center text-neutral-0 border-[0.5px] border-neutral-200">
              <span className="text-xs font-mono font-semibold">
                {(user?.user_metadata?.full_name || 'Guest User')[0].toUpperCase()}
              </span>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="p-2 text-neutral-400 hover:text-brand-danger transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-[6px]"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 pt-[52px] h-screen overflow-hidden">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:block w-[240px] bg-neutral-50 border-r-[0.5px] border-neutral-200 flex-shrink-0 h-full overflow-y-auto">
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 px-4 mb-2 mt-2">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center h-10 px-4 rounded-[6px] transition-all duration-fast font-display text-[13px] font-medium ${
                    isActive
                      ? 'text-brand-accent bg-[#EFF6FF]'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <Icon size={18} className="mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Sidebar - Mobile Drawer */}
        {mobileMenuOpen && (
          <>
            <div 
              className="md:hidden fixed inset-0 bg-neutral-900/40 z-40 transition-opacity duration-base mt-[52px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="md:hidden fixed left-0 top-[52px] bottom-0 w-[240px] bg-neutral-0 border-r-[0.5px] border-neutral-200 z-50 overflow-y-auto animate-slide-in-left">
              <nav className="p-4 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 px-4 mb-2 mt-2">
                  Navigation
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center h-10 px-4 rounded-[6px] transition-all duration-fast font-display text-[13px] font-medium ${
                        isActive
                          ? 'text-brand-accent bg-[#EFF6FF]'
                          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                      }`}
                    >
                      <Icon size={18} className="mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </aside>
          </>
        )}

        {/* Page Content Panel */}
        <main 
          onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 10)}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-9 h-full bg-neutral-50"
        >
          <div className="max-w-[1200px] mx-auto pb-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
