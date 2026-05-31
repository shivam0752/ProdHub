import { supabase, isSupabaseConfigured } from './supabaseClient'
import { useAuthStore } from '../store/authStore'

export async function logAnalyticsEvent(
  eventName: 'tool_viewed' | 'resource_clicked' | 'resource_submitted' | 'rating_submitted' | 'feedback_submitted', 
  properties: Record<string, any> = {}
) {
  const user = useAuthStore.getState().user
  const userId = user?.id || null

  try {
    if (isSupabaseConfigured && userId) {
      const { error } = await supabase
        .from('events')
        .insert([
          {
            user_id: userId,
            event_name: eventName,
            properties
          }
        ])
      if (error) throw error
    } else {
      console.log(`[Analytics Event - Mock Mode] Name: ${eventName}, User: ${userId || 'Anonymous'}, Properties:`, properties)
      
      // Store in mock logs if user wants to inspect
      const eventLogs = localStorage.getItem('prodhub_mock_events')
      const current = eventLogs ? JSON.parse(eventLogs) : []
      current.push({
        id: `mock-event-${Date.now()}`,
        user_id: userId,
        event_name: eventName,
        properties,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('prodhub_mock_events', JSON.stringify(current))
    }
  } catch (err) {
    console.error('Failed to log analytics event:', err)
  }
}
