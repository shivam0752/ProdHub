import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import type { ResourceSuggestion, Resource } from './useResources'
import { SEEDED_RESOURCES } from './useResources'

// Seeded local resources mirror (kept in sync with useResources.ts fallback)
const SEEDED_RESOURCES_ADMIN: Resource[] = [
  { id: 'res-how-to-kickstart-your-pm-career', type: 'link', title: 'How to kickstart your PM career', url: 'https://www.lennysnewsletter.com/p/how-to-kickstart-your-pm-career', description: 'A deep-dive detailing the mechanical paths to transition into product management externally or shifting internally via structural side-projects.', editorial_note: 'Recommended by Indian tech recruiters because it shows how to design side-project product teardowns that prove hard execution and technical logical reasoning before securing an official role.', tags: ['career-transition', 'portfolio'], approved: true, created_at: '2026-05-27T04:15:49.907Z' },
  { id: 'res-how-to-make-a-product-manager-portfolio-step-by-step-guide', type: 'link', title: 'How to make a Product Manager Portfolio: Step by Step Guide', url: 'https://www.theproductfolks.com/product-management-blog/how-to-make-a-product-manager-portfolio-step-by-step-guide', description: 'A step-by-step breakdown on building a comprehensive PM portfolio, detailing how to cleanly present user research and wireframe choices.', editorial_note: 'This guide is a core resource of the Indian Insurjo community, precisely matching the formatting style and depth expected when applying to APM roles at Swiggy, Zepto, or Flipkart.', tags: ['portfolio', 'interview-prep'], approved: true, created_at: '2026-05-27T04:15:49.909Z' },
  { id: 'res-building-a-product-strategy-the-right-way', type: 'link', title: 'Building A Product Strategy, The Right Way', url: 'https://www.theproductfolks.com/product-management-blog/building-a-product-strategy-the-right-way', description: "A tactical session summary with Gojek's former Head of Product, Vikrama Dhiman, on the real-world mechanics of product strategy.", editorial_note: 'Better than standard Western strategic texts because it frames roadmapping around the high-churn, price-sensitive realities of the Indian mobile internet market.', tags: ['product-strategy', 'execution'], approved: true, created_at: '2026-05-27T04:15:49.909Z' },
  { id: 'res-cracking-the-pm-interview', type: 'book', title: 'Cracking the PM Interview', url: 'https://www.amazon.in/Cracking-PM-Interview-Product-Technology/dp/098478281X', description: 'An interview training manual focused on frameworks for responding to design, estimation, and core behavioral questions.', editorial_note: "Chapter 13 on 'Product Case Studies' is exceptionally valuable for aspiring Indian PMs as it serves as the exact playbook local candidates use to structure analytical casing rounds during recruitment.", tags: ['interview-prep', 'books'], approved: true, created_at: '2026-05-27T04:15:49.910Z' },
  { id: 'res-inspired-how-to-create-tech-products-customers-love', type: 'book', title: 'Inspired: How to Create Tech Products Customers Love', url: 'https://www.amazon.in/Inspired-Create-Tech-Products-Customers/dp/1119387507', description: 'A foundational handbook explaining modern discovery loops, delivery engineering patterns, and agile product team alignment.', editorial_note: "Focus on Chapter 16 on 'Product Requirement Documents,' which teaches aspiring PMs how to shift from long, waterfall specification writing to thin, iterative problem framing.", tags: ['fundamentals', 'books'], approved: true, created_at: '2026-05-27T04:15:49.910Z' },
  { id: 'res-kevin-yiens-minimalist-1-page-prd-template', type: 'PRD', title: "Kevin Yien's Minimalist 1-Page PRD Template", url: 'https://coda.io/@kevin-yien/minimal-prd', description: 'A lean, step-by-step document format that omits typical enterprise bureaucracy to focus strictly on user flow sequences, dependencies, and explicit non-goals.', editorial_note: 'This is the ultimate minimal template for an aspiring PM because it leaves zero space for filler text, forcing you to express your feature logic in clean, developer-friendly bullets.', tags: ['prd-template', 'lean'], approved: true, created_at: '2026-05-27T04:15:49.910Z' },
  { id: 'res-the-crisis-foretold-quick-commerce-expansion-and-unit-economics', type: 'case_study', title: 'The Crisis Foretold: Quick Commerce Expansion and Unit Economics', url: 'https://swarajyamag.com/business/dunzo-case-study-a-crisis-foretold', description: "An honest analytical case study tracking Dunzo's aggressive dark store deployment, cash burn, and subsequent operational scaling crisis.", editorial_note: 'Better than optimistic success stories because it details the actual mathematical breakdown of inventory turnover rates and the high average order value targets needed to sustain quick delivery margins in India.', tags: ['case-study', 'quick-commerce'], approved: true, created_at: '2026-05-27T04:15:49.910Z' },
]

export function useAdmin() {
  const [suggestions, setSuggestions] = useState<ResourceSuggestion[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [resourcesLoading, setResourcesLoading] = useState(true)
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
    fetchResources()

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

  async function fetchResources() {
    try {
      setResourcesLoading(true)
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw error
        // Fall back to seeded resources if DB is empty (same logic as useResources)
        if (data && data.length > 0) {
          setResources(data as Resource[])
        } else {
          setResources(SEEDED_RESOURCES)
        }
      } else {
        const local = localStorage.getItem('prodhub_mock_resources')
        if (local) {
          const parsed: Resource[] = JSON.parse(local)
          // Merge seeded resources with any locally added ones
          const seededIds = new Set(SEEDED_RESOURCES.map(r => r.id))
          const localExtras = parsed.filter(r => !seededIds.has(r.id))
          setResources([...SEEDED_RESOURCES, ...localExtras])
        } else {
          setResources(SEEDED_RESOURCES)
        }
      }
    } catch (err: any) {
      console.error('Error fetching resources for admin:', err)
      // Always show at least the seeded resources on error
      setResources(SEEDED_RESOURCES)
    } finally {
      setResourcesLoading(false)
    }
  }

  const updateResource = async (id: string, updates: Partial<Pick<Resource, 'title' | 'url' | 'description' | 'editorial_note' | 'type' | 'tags'>>) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
      if (error) throw error
    } else {
      const local = localStorage.getItem('prodhub_mock_resources')
      const all: Resource[] = local ? JSON.parse(local) : SEEDED_RESOURCES_ADMIN
      const updated = all.map((r) => r.id === id ? { ...r, ...updates } : r)
      localStorage.setItem('prodhub_mock_resources', JSON.stringify(updated))
    }
    setResources((prev) => prev.map((r) => r.id === id ? { ...r, ...updates } : r))
  }

  const deleteResource = async (id: string) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)
      if (error) throw error
    } else {
      const local = localStorage.getItem('prodhub_mock_resources')
      const all: Resource[] = local ? JSON.parse(local) : SEEDED_RESOURCES_ADMIN
      const filtered = all.filter((r) => r.id !== id)
      localStorage.setItem('prodhub_mock_resources', JSON.stringify(filtered))
    }
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

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

  return { suggestions, loading, error, resources, resourcesLoading, updateResource, deleteResource, approveSuggestion, rejectSuggestion }
}
