import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { ResourceSuggestion, Resource } from './useResources'

export function useAdmin() {
  const [suggestions, setSuggestions] = useState<ResourceSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPendingSuggestions() {
      try {
        setLoading(true)
        if (isSupabaseConfigured) {
          const { data, error } = await supabase
            .from('resource_suggestions')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

          if (error) throw error
          setSuggestions((data as ResourceSuggestion[]) || [])
        } else {
          // Local storage mock suggestions
          const mockSuggestions = localStorage.getItem('prodhub_mock_suggestions')
          const current: ResourceSuggestion[] = mockSuggestions ? JSON.parse(mockSuggestions) : []
          setSuggestions(current.filter(s => s.status === 'pending'))
        }
      } catch (err: any) {
        console.error('Error fetching suggestions:', err)
        setError(err.message || 'Failed to fetch suggestions')
      } finally {
        setLoading(false)
      }
    }

    fetchPendingSuggestions()

    if (isSupabaseConfigured) {
      // Real-time subscription to resource suggestions changes
      const channel = supabase
        .channel('admin-resource-suggestions')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'resource_suggestions'
          },
          (payload: { eventType: string; new: ResourceSuggestion; old: ResourceSuggestion }) => {
            console.log('Realtime change received in admin suggestions:', payload)
            if (payload.eventType === 'INSERT') {
              const newSuggestion = payload.new as ResourceSuggestion
              if (newSuggestion.status === 'pending') {
                setSuggestions((prev) => [newSuggestion, ...prev])
              }
            } else if (payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              const updatedRow = payload.new as ResourceSuggestion
              const oldRow = payload.old as ResourceSuggestion
              const id = updatedRow?.id || oldRow?.id
              
              if (payload.eventType === 'DELETE' || (updatedRow && updatedRow.status !== 'pending')) {
                setSuggestions((prev) => prev.filter((item) => item.id !== id))
              } else if (updatedRow && updatedRow.status === 'pending') {
                setSuggestions((prev) => {
                  const exists = prev.some((item) => item.id === id)
                  if (exists) {
                    return prev.map((item) => (item.id === id ? updatedRow : item))
                  } else {
                    return [updatedRow, ...prev]
                  }
                })
              }
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [])

  const approveSuggestion = async (suggestionId: string, editorialNote: string) => {
    if (!editorialNote.trim()) {
      throw new Error('Editorial note is required before approval')
    }

    if (isSupabaseConfigured) {
      // 1. Fetch the suggestion details
      const { data: suggestion, error: fetchErr } = await supabase
        .from('resource_suggestions')
        .select('*')
        .eq('id', suggestionId)
        .single()

      if (fetchErr) throw fetchErr
      if (!suggestion) throw new Error('Suggestion not found')

      // 2. Insert into resources
      const { error: insertErr } = await supabase
        .from('resources')
        .insert([
          {
            title: suggestion.title,
            type: suggestion.type,
            url: suggestion.url,
            description: suggestion.description,
            editorial_note: editorialNote,
            approved: true
          }
        ])

      if (insertErr) throw insertErr

      // 3. Update status in suggestions
      const { error: updateErr } = await supabase
        .from('resource_suggestions')
        .update({ status: 'approved' })
        .eq('id', suggestionId)

      if (updateErr) throw updateErr

      // Remove from list
      setSuggestions((prev) => prev.filter((item) => item.id !== suggestionId))
    } else {
      // Mock approval
      const mockSuggestions = localStorage.getItem('prodhub_mock_suggestions')
      const currentSuggestions: ResourceSuggestion[] = mockSuggestions ? JSON.parse(mockSuggestions) : []
      const suggestion = currentSuggestions.find((s) => s.id === suggestionId)

      if (!suggestion) throw new Error('Suggestion not found')
      suggestion.status = 'approved'
      localStorage.setItem('prodhub_mock_suggestions', JSON.stringify(currentSuggestions))

      // Copy to mock resources
      const mockResources = localStorage.getItem('prodhub_mock_resources')
      const currentResources: Resource[] = mockResources ? JSON.parse(mockResources) : []
      
      const newResource: Resource = {
        id: `mock-res-${Date.now()}`,
        title: suggestion.title,
        type: suggestion.type,
        url: suggestion.url,
        description: suggestion.description,
        editorial_note: editorialNote,
        approved: true,
        created_at: new Date().toISOString()
      }
      currentResources.push(newResource)
      localStorage.setItem('prodhub_mock_resources', JSON.stringify(currentResources))

      // Remove from local list
      setSuggestions((prev) => prev.filter((item) => item.id !== suggestionId))
    }
  }

  const rejectSuggestion = async (suggestionId: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('resource_suggestions')
        .update({ status: 'rejected' })
        .eq('id', suggestionId)

      if (error) throw error

      setSuggestions((prev) => prev.filter((item) => item.id !== suggestionId))
    } else {
      // Mock rejection
      const mockSuggestions = localStorage.getItem('prodhub_mock_suggestions')
      const currentSuggestions: ResourceSuggestion[] = mockSuggestions ? JSON.parse(mockSuggestions) : []
      const suggestion = currentSuggestions.find((s) => s.id === suggestionId)

      if (!suggestion) throw new Error('Suggestion not found')
      suggestion.status = 'rejected'
      localStorage.setItem('prodhub_mock_suggestions', JSON.stringify(currentSuggestions))

      setSuggestions((prev) => prev.filter((item) => item.id !== suggestionId))
    }
  }

  return { suggestions, loading, error, approveSuggestion, rejectSuggestion }
}
