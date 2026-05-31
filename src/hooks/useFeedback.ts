import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { logAnalyticsEvent } from '../lib/analytics'

export interface FeedbackItem {
  id: string
  user_id?: string
  name: string
  text: string
  rating?: number
  created_at: string
}

export function useFeedback() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuthStore()

  const fetchFeedback = async () => {
    try {
      setLoading(true)
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setFeedbackList((data as FeedbackItem[]) || [])
      } else {
        const mockFeedback = localStorage.getItem('prodhub_mock_feedback')
        setFeedbackList(mockFeedback ? JSON.parse(mockFeedback) : [])
      }
    } catch (err: any) {
      console.error('Error fetching feedback:', err)
      setError(err.message || 'Failed to fetch feedback')
      
      // Fallback on database error
      const mockFeedback = localStorage.getItem('prodhub_mock_feedback')
      setFeedbackList(mockFeedback ? JSON.parse(mockFeedback) : [])
    } finally {
      setLoading(false)
    }
  }

  const submitFeedback = async (name: string, text: string, rating: number) => {
    const isUuid = (val: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
    const validUserId = user?.id && isUuid(user.id) ? user.id : null

    const feedbackData = {
      user_id: validUserId,
      name,
      text,
      rating: rating || null
    }

    try {
      if (isSupabaseConfigured) {
        // 1. Submit to feedback table
        const { data, error } = await supabase
          .from('feedback')
          .insert([feedbackData])
          .select()

        if (error) throw error

        // 2. If a rating is chosen, upsert into ratings table as well
        if (rating && user && isUuid(user.id)) {
          const { error: ratingErr } = await supabase
            .from('ratings')
            .upsert(
              { user_id: user.id, score: rating },
              { onConflict: 'user_id' }
            )
          if (ratingErr) {
            console.error('Failed to sync rating to ratings table:', ratingErr)
          } else {
            // Log rating submitted event
            await logAnalyticsEvent('rating_submitted', { score: rating })
          }
        }

        // Log feedback submitted event
        await logAnalyticsEvent('feedback_submitted' as any, { rating })
        
        await fetchFeedback()
        return data
      } else {
        throw new Error('Supabase not configured, falling back to mock mode')
      }
    } catch (err: any) {
      console.warn('Supabase insert failed, using mock mode fallback:', err)
      
      // Mock mode fallback
      const mockFeedback = localStorage.getItem('prodhub_mock_feedback')
      const current = mockFeedback ? JSON.parse(mockFeedback) : []
      const newFeedback: FeedbackItem = {
        id: `mock-fb-${Date.now()}`,
        user_id: user?.id || 'mock-user-uuid-123456',
        name,
        text,
        rating: rating || undefined,
        created_at: new Date().toISOString()
      }
      current.unshift(newFeedback)
      localStorage.setItem('prodhub_mock_feedback', JSON.stringify(current))

      // Update ratings mock fallback
      if (rating) {
        const mockRatings = localStorage.getItem('prodhub_mock_ratings')
        const currentRatings = mockRatings ? JSON.parse(mockRatings) : []
        const userId = user?.id || 'mock-user-uuid-123456'
        const existingIdx = currentRatings.findIndex((r: any) => r.user_id === userId)
        if (existingIdx >= 0) {
          currentRatings[existingIdx].score = rating
        } else {
          currentRatings.push({ user_id: userId, score: rating })
        }
        localStorage.setItem('prodhub_mock_ratings', JSON.stringify(currentRatings))
        await logAnalyticsEvent('rating_submitted', { score: rating })
      }

      await logAnalyticsEvent('feedback_submitted' as any, { rating })
      setFeedbackList(current)
      return [newFeedback]
    }
  }

  useEffect(() => {
    fetchFeedback()
  }, [])

  return { feedbackList, loading, error, submitFeedback, refetch: fetchFeedback }
}
