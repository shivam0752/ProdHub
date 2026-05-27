import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Validate that we have a real Supabase URL and key
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' && !url.includes('placeholder.supabase.co')
  } catch {
    return false
  }
}

export const isSupabaseConfigured = 
  isValidUrl(supabaseUrl) && 
  Boolean(supabaseAnonKey) && 
  supabaseAnonKey !== 'placeholder-anon-key'

// If not configured, we export null and handle fallbacks gracefully in hooks and stores
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as any)
