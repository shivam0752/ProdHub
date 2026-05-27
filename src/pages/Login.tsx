import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { isSupabaseConfigured } from '../lib/supabaseClient'
import { Terminal, Star, CheckCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Login() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    if (user && !loading) {
      navigate('/')
    }
  }, [user, loading, navigate])

  const handleLogin = async () => {
    setSigningIn(true)
    try {
      if (!isSupabaseConfigured) {
        toast.success("Using local mock mode (no Supabase detected)")
      }
      await signInWithGoogle()
    } catch (error: any) {
      toast.error(error.message || "Failed to log in")
    } finally {
      setSigningIn(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-accent border-t-transparent animate-spin rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-600 font-body">
      {/* Brand Hero Side */}
      <div className="flex-1 bg-brand-navy text-neutral-0 p-5 md:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r-[0.5px] border-neutral-200">
        <div className="flex items-center gap-2">
          <Terminal className="text-brand-punch" size={24} />
          <span className="font-display font-bold text-xl tracking-tight text-neutral-0">ProdHub</span>
          <span className="text-[10px] font-mono uppercase bg-brand-punch text-neutral-900 px-1.5 py-0.5 font-bold">Fellowship Edition</span>
        </div>

        <div className="space-y-6 my-6 md:my-0 max-w-xl">
          <div className="inline-block bg-neutral-900/40 border border-white/10 text-brand-punch font-mono text-xs px-2.5 py-1 uppercase tracking-wider rounded-[0px]">
            Aspiring PM Curation Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-neutral-0 leading-tight tracking-[-0.02em]">
            Clear, curated PM knowledge for the Indian market.
          </h1>
          <p className="text-white/55 text-lg leading-relaxed">
            No SEO optimization. No affiliate links. No corporate jargon. Just frameworks, metrics, and resources mapped to real Indian products like Swiggy, Zepto, and Razorpay.
          </p>

          <div className="space-y-3 pt-4 font-display font-semibold">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-brand-positive" size={18} />
              <span className="text-neutral-100">20+ Seeded PM tools & prioritization grids</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-brand-positive" size={18} />
              <span className="text-neutral-100">Curated resources with mandatory editorial context</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="text-brand-positive" size={18} />
              <span className="text-neutral-100">India-specific resume guidelines & interview benchmarks</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-white/35 font-mono">
          Built by a PM Fellow. Inspired by the FMHY model of obsessive quality.
        </div>
      </div>

      {/* Auth Action Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-5 md:p-16 bg-neutral-0">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-display font-bold text-neutral-900">Get Started</h2>
            <p className="text-neutral-400 text-sm">
              Sign in with your Google account to access tools, templates, and resume tips.
            </p>
          </div>

          {/* Info box */}
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-5 space-y-3 rounded-lg">
            <div className="flex items-center gap-2 text-brand-navy font-bold font-display text-sm">
              <Star className="text-brand-punch fill-brand-punch" size={16} />
              Why Google OAuth?
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-body">
              We value security and simplicity. By using Google OAuth via Supabase, we do not store your passwords, lowering the security risk to zero.
            </p>
            {!isSupabaseConfigured && (
              <div className="bg-brand-punch/10 border border-brand-punch/20 text-neutral-900 p-2.5 text-xs font-mono rounded-[4px]">
                <strong>Local Test Mode:</strong> No Supabase client credentials found in `.env`. Clicking login will authorize a mock test administrator account immediately.
              </div>
            )}
          </div>

          <button
            onClick={handleLogin}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 h-[48px] bg-brand-navy text-neutral-0 rounded-md font-display font-bold text-base hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast focus:outline-none focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] border-none cursor-pointer"
          >
            {signingIn ? (
              <div className="w-5 h-5 border-2 border-neutral-0 border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V13.4h6.887c-.648 2.41-2.519 4.13-5.136 4.13A5.71 5.71 0 0 1 8.2 11.83a5.71 5.71 0 0 1 5.79-5.7c1.579 0 3.017.58 4.12 1.54l2.454-2.45A9.697 9.697 0 0 0 13.99 2A9.9 9.9 0 0 0 4 11.83a9.9 9.9 0 0 0 9.99 9.83c5.524 0 9.99-4 9.99-9.83 0-.685-.08-1.215-.22-1.545H12.24Z" />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
