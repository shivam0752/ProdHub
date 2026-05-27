import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Terminal, BookOpen, FileText, ArrowRight, Info, Award } from 'lucide-react'
import LiveCount from '../components/LiveCount'
import StarRating from '../components/StarRating'

export default function Home() {
  const { role } = useAuth()

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Hero Welcome banner */}
      <section className="bg-brand-navy text-neutral-0 p-5 md:p-9 rounded-card relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-accent via-brand-punch to-transparent" />

        <div className="space-y-4 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-neutral-900/40 border border-white/10 px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-[0.10em] text-brand-punch rounded-[0px]">
            <span className="w-1.25 h-1.25 rounded-full bg-brand-punch" />
            Welcome to the Hub
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-neutral-0 tracking-[-0.02em] leading-tight">
            Hey! Let's build better product thinking.
          </h1>
          <p className="text-white/55 text-[13px] leading-relaxed">
            Welcome to your curated center for breaking into PM in India. Explore PM frameworks, resources, and resume tactics built through actual product validation.
          </p>
        </div>
      </section>

      {/* Grid Quick Navigation Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Tools panel card */}
        <div className="bg-neutral-0 border border-neutral-200 p-5 flex flex-col justify-between hover:border-brand-accent hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] hover:translate-y-[-1px] transition-all duration-base rounded-card">
          <div className="space-y-3">
            <div className="w-9 h-9 bg-[#EFF6FF] rounded-[8px] flex items-center justify-center text-[#2563EB] border-[0.5px] border-[#BFDBFE]">
              <Terminal size={18} />
            </div>
            <h3 className="font-display font-bold text-[15px] text-neutral-900">PM Tools Hub</h3>
            <p className="text-[13px] text-neutral-600 leading-relaxed">
              Explore 20+ PM core metrics, prioritization grids, and frameworks illustrated with actual Indian market examples (Swiggy, Razorpay, CRED).
            </p>
          </div>
          <Link
            to="/tools"
            className="mt-6 flex items-center gap-1.5 text-[13px] font-display font-semibold text-brand-accent hover:text-brand-navy transition-colors duration-fast"
          >
            <span>Browse PM Tools</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Resources panel card */}
        <div className="bg-neutral-0 border border-neutral-200 p-5 flex flex-col justify-between hover:border-brand-accent hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] hover:translate-y-[-1px] transition-all duration-base rounded-card">
          <div className="space-y-3">
            <div className="w-9 h-9 bg-[#FFFBEB] rounded-[8px] flex items-center justify-center text-[#D97706] border-[0.5px] border-[#FDE68A]">
              <BookOpen size={18} />
            </div>
            <h3 className="font-display font-bold text-[15px] text-neutral-900">Curated Resources</h3>
            <p className="text-[13px] text-neutral-600 leading-relaxed">
              Read editorialized links, recommended books, and approved real-world PRDs from experienced Indian product leads.
            </p>
          </div>
          <Link
            to="/resources"
            className="mt-6 flex items-center gap-1.5 text-[13px] font-display font-semibold text-brand-accent hover:text-brand-navy transition-colors duration-fast"
          >
            <span>Explore Resources</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Resume tips card */}
        <div className="bg-neutral-0 border border-neutral-200 p-5 flex flex-col justify-between hover:border-brand-accent hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] hover:translate-y-[-1px] transition-all duration-base rounded-card">
          <div className="space-y-3">
            <div className="w-9 h-9 bg-[#EFF2FA] rounded-[8px] flex items-center justify-center text-[#0F2D52] border-[0.5px] border-neutral-200">
              <FileText size={18} />
            </div>
            <h3 className="font-display font-bold text-[15px] text-neutral-900">Resume & Tactics</h3>
            <p className="text-[13px] text-neutral-600 leading-relaxed">
              Get resume tips, key action verbs recruiters filter for, and specific guidance tailored to Zepto, Flipkart, and Swiggy hiring pools.
            </p>
          </div>
          <Link
            to="/resume-tips"
            className="mt-6 flex items-center gap-1.5 text-[13px] font-display font-semibold text-brand-accent hover:text-brand-navy transition-colors duration-fast"
          >
            <span>Read Resume Tips</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Main Info Columns */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
        {/* Origin story & validation */}
        <div className="space-y-6 bg-neutral-0 border border-neutral-200 p-6 md:p-8 rounded-card">
          <h2 className="text-[20px] font-display font-extrabold text-neutral-900 flex items-center gap-2">
            <Info className="text-brand-accent" size={20} />
            Why ProdHub?
          </h2>

          <div className="space-y-4 text-[13px] text-neutral-600 leading-relaxed">
            <p>
              ProdHub is a free repository created to address specific gaps validated via user surveys of <strong> PM Fellows</strong>. Many aspiring product managers struggle with translating textbook theories into day-to-day thinking.
            </p>

            <p>
              Most online templates are US-centric, referencing companies like Uber, Stripe, and Airbnb. While helpful, they don't map directly to the competitive dynamics of <strong>quick commerce (Zepto, Blinkit)</strong>, <strong>high-scale transactional fintech (Razorpay, CRED)</strong>, or <strong>complex food logistics (Swiggy, Zomato)</strong> in India.
            </p>

            <blockquote className="border-l-[3px] border-brand-punch bg-neutral-50 p-4 font-mono text-[9px] uppercase tracking-[0.08em] text-neutral-600">
              "We focus on editorial quality over volume. Every framework, suggestion, or link must carry a clear sentence explaining exactly why it belongs and how to apply it."
            </blockquote>
          </div>
        </div>

        {/* Community Stats & Rating widgets */}
        <div className="space-y-3">
          <LiveCount />

          <StarRating />

          {/* Admin quick entry if admin */}
          {role === 'admin' && (
            <div className="bg-brand-accent/5 border border-dashed border-brand-accent p-5 space-y-3 rounded-card">
              <div className="flex items-center gap-2 text-brand-accent font-bold font-display text-sm">
                <Award size={18} />
                Administrator Mode Active
              </div>
              <p className="text-xs text-neutral-600">
                You have admin privileges. You can view pending resource submissions and manage data.
              </p>
              <Link
                to="/admin"
                className="inline-flex items-center justify-center bg-brand-navy text-neutral-0 text-xs font-semibold px-4 h-8 rounded-md focus:outline-none hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

