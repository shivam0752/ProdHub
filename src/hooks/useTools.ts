import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { SEEDED_TOOLS } from '../constants/tools'
import type { Tool } from '../constants/tools'

export function useTools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true)
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('tools')
            .select('*')
            .order('title', { ascending: true })

          if (error) throw error
          
          if (data && data.length > 0) {
            setTools(data as Tool[])
          } else {
            // If table exists but empty, fall back to seeded constants
            setTools(SEEDED_TOOLS)
          }
        } else {
          // If no Supabase configured, fall back to seeded constants
          setTools(SEEDED_TOOLS)
        }
      } catch (err: any) {
        console.error('Error fetching tools from Supabase:', err)
        setError(err.message || 'Failed to fetch tools')
        // Fallback on error to ensure app works
        setTools(SEEDED_TOOLS)
      } finally {
        setLoading(false)
      }
    }

    fetchTools()
  }, [])

  return { tools, loading, error }
}
