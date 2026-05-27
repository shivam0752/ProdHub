import { useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

export function useAuth() {
  const { user, role, loading, setUser, setRole, setLoading } = useAuthStore()

  useEffect(() => {
    if (isSupabaseConfigured) {
      // 1. Supabase real flow
      supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          fetchRole(session.user.id)
        } else {
          setRole(null)
          setLoading(false)
        }
      })

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event: AuthChangeEvent, session: Session | null) => {
          setUser(session?.user ?? null)
          if (session?.user) {
            fetchRole(session.user.id)
          } else {
            setRole(null)
            setLoading(false)
          }
        }
      )


      return () => {
        subscription.unsubscribe()
      }
    } else {
      // 2. Mock mode for local testing
      const storedUser = localStorage.getItem('prodhub_mock_user')
      const storedRole = localStorage.getItem('prodhub_mock_role')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setRole((storedRole as 'user' | 'admin') || 'user')
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    }
  }, [setUser, setRole, setLoading])

  async function fetchRole(userId: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) throw error
      if (data) {
        setRole(data.role as 'user' | 'admin')
      } else {
        setRole('user') // default fallback
      }
    } catch (err) {
      console.error('Error fetching role:', err)
      setRole('user')
    } finally {
      setLoading(false)
    }
  }

  async function signInWithGoogle() {
    if (isSupabaseConfigured) {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
    } else {
      // Create mock user data
      const mockUser: Partial<User> = {
        id: 'mock-user-uuid-123456',
        email: 'aspiringpm@nextleap.in',
        email_confirmed_at: new Date().toISOString(),
        user_metadata: {
          full_name: 'Ananya Sharma',
          avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
        },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      localStorage.setItem('prodhub_mock_user', JSON.stringify(mockUser))
      localStorage.setItem('prodhub_mock_role', 'admin') // Default to admin for full testing capability locally
      setUser(mockUser as User)
      setRole('admin')
    }
  }

  async function signOut() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      localStorage.removeItem('prodhub_mock_user')
      localStorage.removeItem('prodhub_mock_role')
      setUser(null)
      setRole(null)
    }
  }

  return { user, role, loading, signInWithGoogle, signOut }
}
