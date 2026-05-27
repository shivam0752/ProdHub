import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { useAuthStore } from '../store/authStore'
import { logAnalyticsEvent } from '../lib/analytics'
import toast from 'react-hot-toast'

interface RatingSummary {
  average: number
  count: number
  userScore: number | null
}

export default function StarRating() {
  const { user } = useAuthStore()
  const [summary, setSummary] = useState<RatingSummary>({ average: 0, count: 0, userScore: null })
  const [hoverScore, setHoverScore] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Fetch ratings from Supabase or localStorage
  const fetchRatings = async () => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase
          .from('ratings')
          .select('user_id, score')

        if (error) throw error

        if (data) {
          const count = data.length
          const sum = data.reduce((acc: number, curr: { score: number }) => acc + curr.score, 0)
          const average = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0
          
          // Check if current user has rated
          const userRating = data.find((r: { user_id: string }) => r.user_id === user?.id)
          
          setSummary({
            average,
            count,
            userScore: userRating ? userRating.score : null
          })
        }
      } else {
        // Mock rating reading
        const mockRatings = localStorage.getItem('prodhub_mock_ratings')
        const data: { user_id: string; score: number }[] = mockRatings ? JSON.parse(mockRatings) : []
        const count = data.length
        const sum = data.reduce((acc: number, curr: { score: number }) => acc + curr.score, 0)
        const average = count > 0 ? parseFloat((sum / count).toFixed(1)) : 0
        const userRating = data.find((r: { user_id: string }) => r.user_id === (user?.id || 'mock-user-uuid-123456'))

        setSummary({
          average,
          count,
          userScore: userRating ? userRating.score : null
        })
      }
    } catch (err) {
      console.error('Error fetching ratings:', err)
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [user])

  const handleRating = async (score: number) => {
    if (submitting) return
    setSubmitting(true)
    try {
      if (isSupabaseConfigured && user) {
        const { error } = await supabase
          .from('ratings')
          .upsert(
            { user_id: user.id, score },
            { onConflict: 'user_id' }
          )

        if (error) throw error
      } else {
        // Mock rating upsert
        const mockRatings = localStorage.getItem('prodhub_mock_ratings')
        const current: { user_id: string; score: number }[] = mockRatings ? JSON.parse(mockRatings) : []
        const userId = user?.id || 'mock-user-uuid-123456'
        
        const existingIdx = current.findIndex((r) => r.user_id === userId)
        if (existingIdx >= 0) {
          current[existingIdx].score = score
        } else {
          current.push({ user_id: userId, score })
        }
        localStorage.setItem('prodhub_mock_ratings', JSON.stringify(current))
      }

      await logAnalyticsEvent('rating_submitted', { score })
      toast.success(summary.userScore ? 'Rating updated!' : 'Thank you for your rating!')
      await fetchRatings()
    } catch (err: any) {
      console.error('Error saving rating:', err)
      toast.error(err.message || 'Failed to submit rating')
    } finally {
      setSubmitting(false)
    }
  }

  const renderStars = () => {
    const activeScore = hoverScore !== null ? hoverScore : (summary.userScore || 0)
    
    return (
      <div 
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverScore(null)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverScore(star)}
            className="text-2xl transition-colors duration-fast focus:outline-none"
            style={{ 
              color: star <= activeScore ? 'var(--color-brand-punch)' : 'var(--color-neutral-200)' 
            }}
            aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            {star <= activeScore ? '★' : '☆'}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-neutral-0 border border-neutral-200 p-5 flex flex-col justify-between rounded-card space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-medium">
          App Rating
        </span>
        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-medium">
          {summary.userScore ? 'Submitted' : 'Interactive'}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-[36px] font-mono font-medium text-neutral-900 leading-none">
          {summary.average}
        </div>
        <div className="space-y-1">
          {renderStars()}
          <div className="text-xs text-neutral-600 font-body">
            ({summary.count} rating{summary.count === 1 ? '' : 's'})
          </div>
        </div>
      </div>
    </div>
  )
}
