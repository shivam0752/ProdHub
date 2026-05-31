import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { useFeedback } from '../hooks/useFeedback'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { MessageSquare, Award, Heart, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Feedback() {
  const { user } = useAuthStore()
  const { submitFeedback } = useFeedback()
  
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [rating, setRating] = useState<number>(0)
  const [hoverScore, setHoverScore] = useState<number | null>(null)
  
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false)

  // Pre-fill name and rating
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setName(user.user_metadata.full_name)
    }

    async function loadUserRating() {
      try {
        if (isSupabaseConfigured && user) {
          const { data, error } = await supabase
            .from('ratings')
            .select('score')
            .eq('user_id', user.id)
            .maybeSingle()
          
          if (data && !error) {
            setRating(data.score)
          }
        } else {
          const mockRatings = localStorage.getItem('prodhub_mock_ratings')
          const currentRatings = mockRatings ? JSON.parse(mockRatings) : []
          const userId = user?.id || 'mock-user-uuid-123456'
          const existing = currentRatings.find((r: any) => r.user_id === userId)
          if (existing) {
            setRating(existing.score)
          }
        }
      } catch (err) {
        console.error('Error pre-loading rating:', err)
      }
    }

    loadUserRating()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      toast.error('Please enter your name.')
      return
    }
    if (!text.trim()) {
      toast.error('Please write some feedback before submitting.')
      return
    }
    if (rating === 0) {
      toast.error('Please select a rating from 1 to 5 stars.')
      return
    }

    setSubmitting(true)
    try {
      await submitFeedback(name.trim(), text.trim(), rating)
      toast.success('Thank you! Feedback and rating submitted.')
      setSubmittedSuccessfully(true)
      setText('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit feedback.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSubmittedSuccessfully(false)
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header Banner */}
      <section className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-brand-accent" size={28} />
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
            Feedback &amp; Rating
          </h1>
        </div>
        <p className="text-sm text-neutral-400 max-w-xl">
          We build ProdHub in public for NextLeap PM fellows. Help us refine existing frameworks, suggest metrics, or report bugs.
        </p>
      </section>

      {/* Main Content Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Form Container */}
        <div>
          {submittedSuccessfully ? (
            <div className="bg-neutral-0 border border-neutral-200 p-8 rounded-card text-center space-y-4 max-w-xl">
              <div className="w-12 h-12 bg-[#F0FDF4] rounded-full flex items-center justify-center text-brand-positive mx-auto border-[0.5px] border-[#BBF7D0]">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-900">Feedback Submitted Successfully!</h3>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-md mx-auto">
                Thank you for your response, <strong>{name}</strong>. Your feedback and rating of <strong>{rating} stars</strong> have been recorded to help us improve the ProdHub platform.
              </p>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center bg-brand-navy text-neutral-0 text-xs font-semibold px-4 h-8 rounded-md hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast"
              >
                Send Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-neutral-0 border border-neutral-200 p-6 md:p-8 rounded-card space-y-6 max-w-xl">
              {/* Rating Star Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium">
                  Overall Rating <span className="text-brand-danger">*</span>
                </label>
                <div 
                  className="flex items-center gap-1.5 py-1"
                  onMouseLeave={() => setHoverScore(null)}
                >
                  {[1, 2, 3, 4, 5].map((star) => {
                    const activeScore = hoverScore !== null ? hoverScore : rating
                    const isActive = star <= activeScore
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverScore(star)}
                        className="text-3xl focus:outline-none transition-colors duration-fast hover:scale-105 active:scale-95"
                        style={{
                          color: isActive ? 'var(--color-brand-punch)' : 'var(--color-neutral-200)'
                        }}
                        aria-label={`Select ${star} Stars`}
                      >
                        {isActive ? '★' : '☆'}
                      </button>
                    )
                  })}
                  {rating > 0 && (
                    <span className="text-xs text-neutral-400 font-mono ml-2 font-medium">
                      ({rating}/5)
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-neutral-400">
                  Select a star rating to score your experience using ProdHub.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label htmlFor="user-name" className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium">
                  Your Name <span className="text-brand-danger">*</span>
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full p-3 bg-neutral-0 border border-neutral-200 rounded-md text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast font-body text-neutral-800"
                />
              </div>

              {/* Feedback Text Area */}
              <div className="space-y-1.5">
                <label htmlFor="feedback-text" className="block text-[11px] font-mono uppercase tracking-widest text-neutral-400 font-medium">
                  Your Feedback <span className="text-brand-danger">*</span>
                </label>
                <textarea
                  id="feedback-text"
                  rows={6}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Tell us what you like, what is missing, or how we can improve. Detailed suggestions are highly appreciated!"
                  required
                  className="w-full p-3 bg-neutral-0 border border-neutral-200 rounded-md text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast font-body text-neutral-800 resize-none"
                />
                <div className="flex justify-between items-center text-[10px] text-neutral-400 mt-1">
                  <span>Please be detailed and constructive.</span>
                  <span>{text.length} characters</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full h-10 bg-brand-navy text-neutral-0 font-display font-semibold text-xs rounded-md hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-neutral-0 border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  'Submit Feedback & Rating'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info Panels */}
        <div className="space-y-4">
          {/* Privacy & Trust info */}
          <div className="bg-neutral-0 border border-neutral-200 p-5 rounded-card space-y-3">
            <div className="flex items-center gap-2 text-brand-navy font-bold font-display text-sm">
              <Award size={18} className="text-brand-punch" />
              <span>Curation &amp; Trust</span>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed font-body">
              ProdHub is a fully non-profit, non-commercial initiative built for the PM community. We do not sell data or run ads.
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed font-body">
              Your feedback goes directly to our dashboard so we can prioritize adding the metrics, case studies, and tools that help you succeed.
            </p>
          </div>

          {/* Heart widget */}
          <div className="bg-brand-navy text-neutral-0 p-5 rounded-card space-y-3 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent via-brand-punch to-transparent" />
            <div className="flex items-center gap-2 text-white font-bold font-display text-sm">
              <Heart size={16} className="text-brand-punch fill-brand-punch" />
              <span>Built in Public</span>
            </div>
            <p className="text-white/55 text-xs leading-relaxed font-body">
              This project is built incrementally based on user demand. If you have tool mock-ups or specific PRD resources, submit them in the Resources tab!
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
