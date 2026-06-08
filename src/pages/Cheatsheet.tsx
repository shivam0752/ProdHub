import { useState, useEffect } from 'react'
import {
  BarChart2,
  TrendingUp,
  FlaskConical,
  Star,
  Zap,
  ChevronDown,
  ChevronUp,
  Activity,
  Target,
  AlertCircle,
  BookOpen,
  Layers,
  Hash,
  Printer,
  X,
} from 'lucide-react'

// ─────────────────────────────────────────────
// DATA — PM Analytics Cheat Sheet
// ─────────────────────────────────────────────

const METRICS = [
  {
    name: 'DAU', full: 'Daily Active Users',
    def: 'Count of unique users who perform at least one session or action in a single day.',
    when: 'Track daily product health, engagement velocity, or impact of a daily-habit feature.',
    example: "Instagram's DAU is a north star — if a push notification change drops DAU by 3% next day, we roll back immediately.",
    mistakes: ['Confusing sessions with users', "Not defining what 'active' means (login vs meaningful action)"],
    related: ['WAU', 'MAU', 'DAU/MAU ratio'],
  },
  {
    name: 'WAU', full: 'Weekly Active Users',
    def: 'Count of unique users who are active within any rolling 7-day window.',
    when: 'For products with weekly natural cadence — work tools, news, B2B SaaS.',
    example: "Notion's WAU/MAU ratio of 0.7 tells us most monthly users actually return weekly — strong retention signal.",
    mistakes: ['Using calendar weeks instead of rolling 7 days — creates artificial Monday spikes'],
    related: ['DAU', 'MAU', 'Retention'],
  },
  {
    name: 'MAU', full: 'Monthly Active Users',
    def: 'Count of unique users active within a rolling 30-day window.',
    when: 'Reporting product scale, investor metrics, or low-frequency products (travel, tax).',
    example: 'Our MAU grew 15% QoQ, but DAU/MAU dropped from 0.4 to 0.3 — users are signing up but not forming habits.',
    mistakes: ['Treating MAU growth as a success signal without checking DAU/MAU ratio — hides engagement hollowness'],
    related: ['DAU', 'WAU', 'Stickiness', 'Churn'],
  },
  {
    name: 'Retention', full: 'Retention Rate',
    def: 'Percentage of users who return and perform a meaningful action after a defined interval post-signup.',
    when: 'Whenever product health, long-term value, or feature stickiness is in question.',
    example: 'D30 retention is 22%. Industry benchmark for social apps is 20–25%. D7 is strong at 55% but D30 drops sharply — the product hooks users early but loses them in week 2.',
    mistakes: ['Using login as retained instead of core action', 'Not segmenting by acquisition channel'],
    related: ['Churn', 'Cohort Analysis', 'LTV'],
  },
  {
    name: 'Churn', full: 'Churn Rate',
    def: 'Percentage of users or revenue lost within a defined period, typically monthly or annually.',
    when: 'Diagnosing subscription health, predicting revenue impact, or evaluating product-market fit degradation.',
    example: 'Monthly churn is 5%. At this rate, we lose ~46% of users annually. Need to cut churn to 2% to hit ARR targets.',
    mistakes: ['Confusing user churn with revenue churn', 'Not measuring involuntary churn (payment failures) separately'],
    related: ['Retention', 'LTV', 'CAC'],
  },
  {
    name: 'CVR', full: 'Conversion Rate',
    def: 'Percentage of users who complete a desired action out of those who had the opportunity.',
    when: 'Analyzing funnels, testing checkout flows, evaluating onboarding, or pricing page changes.',
    example: 'Free-to-paid conversion is 3.2%. The bottleneck is step 3 of checkout — 60% of drop-offs happen there. An A/B test on payment form lifted it to 4.1%.',
    mistakes: ['Reporting aggregate CVR without segmenting by traffic source or device'],
    related: ['Funnel Analysis', 'Activation Rate', 'A/B Testing'],
  },
  {
    name: 'LTV', full: 'Lifetime Value',
    def: 'Total predicted revenue a customer generates over their entire relationship with the product.',
    when: 'Setting CAC targets, justifying growth spend, evaluating customer segments, or pricing decisions.',
    example: 'LTV = ARPU / churn rate = $40/month ÷ 5% = $800. With CAC at $120, LTV/CAC = 6.7x — healthy.',
    mistakes: ['Using simple average LTV across segments', 'Ignoring time value of money'],
    related: ['CAC', 'Churn', 'ARPU', 'Payback Period'],
  },
  {
    name: 'CAC', full: 'Customer Acquisition Cost',
    def: 'Total cost spent on sales and marketing divided by the number of new customers acquired in that period.',
    when: 'Evaluating channel efficiency, growth sustainability, or fundraising projections.',
    example: 'Blended CAC is $120. Paid CAC is $320 vs organic $40. Paid users churn 2x faster — organic customers are 3x more valuable.',
    mistakes: ['Using blended CAC only and missing channel-level efficiency differences'],
    related: ['LTV', 'Payback Period', 'Channel Attribution'],
  },
]

const VISUALIZATIONS = [
  { name: 'Line Chart', when: 'Tracking a metric over time — trend, growth, seasonality, anomaly detection.', trigger: ['trend', 'over time', 'dropped', 'grew'] },
  { name: 'Bar Chart', when: 'Comparing values across categories — segments, features, channels, time buckets.', trigger: ['compare', 'breakdown', 'by segment', 'distribution'] },
  { name: 'Funnel Chart', when: 'Find where users abandon a flow — onboarding, checkout, signup, activation.', trigger: ['drop off', 'conversion', 'where users leave'] },
  { name: 'Cohort Chart', when: 'Compare retention across user groups acquired at different times — isolates mix shift.', trigger: ['retention over time', 'cohort', 'compare groups'] },
  { name: 'Heatmap', when: 'Finding patterns across two dimensions simultaneously — time patterns, feature density.', trigger: ['pattern', 'peak times', 'usage density'] },
  { name: 'Scatter Plot', when: 'Exploring relationship between two metrics or identifying users with unusual behavior.', trigger: ['correlation', 'relationship between', 'outliers', 'cluster'] },
]

const STAT_TOOLS = [
  { name: 'A/B Testing', def: 'Controlled experiment randomly assigning users to control/treatment to measure causal effect of a change.' },
  { name: 'Confidence Interval', def: 'Range that, with 95% probability, contains the true population parameter. CI excludes zero → significant.' },
  { name: 'P-value', def: 'Probability of observing a result at least as extreme if there were no effect. p<0.05 = reject null hypothesis.' },
  { name: 'Power Analysis', def: 'Determines probability of detecting a real effect given sample size, α, and MDE. Always do this before running.' },
  { name: 'Sample Size', def: 'Minimum observations needed to detect an effect with 80% power and α=0.05. Calculate before, not after.' },
  { name: 'Std Deviation', def: 'How much data deviates from the mean. 2σ from mean = investigate. 3σ = almost certainly a real signal.' },
]

const TRIGGERS = [
  { says: 'Users are dropping off', use: ['Funnel Analysis', 'Funnel Chart', 'CVR', 'Session Replay'] },
  { says: 'Retention dropped', use: ['Cohort Analysis', 'Confidence Interval', 'Segmentation', 'RCA'] },
  { says: 'Run an experiment', use: ['A/B Testing', 'Sample Size', 'Power Analysis', 'Guardrail Metrics'] },
  { says: 'Metric anomaly / spike', use: ['Std Deviation', 'RCA', 'Segmentation', 'Annotated Line Chart'] },
  { says: 'Users are churning', use: ['Churn Analysis', 'Cohort Chart', 'Behavioral Predictors', 'LTV'] },
  { says: 'How healthy is the product?', use: ['DAU/MAU Ratio', 'Retention Curve', 'LTV/CAC', 'North Star'] },
  { says: 'Onboarding isn\'t working', use: ['Activation Rate', 'Funnel Chart', 'D1/D7 Retention', 'Session Heatmap'] },
  { says: 'Growth is slowing', use: ['CAC by Channel', 'MAU Trend', 'Activation Rate', 'Cohort Comparison'] },
]

const FORMULAS = [
  { label: 'Stickiness', formula: 'DAU ÷ MAU', benchmark: 'Above 0.5 = strong habit. Below 0.2 = weak engagement.' },
  { label: 'Churn Rate', formula: 'Users lost ÷ Users at start × 100', benchmark: 'Monthly churn of 5% = ~46% annual loss.' },
  { label: 'LTV', formula: 'ARPU ÷ Monthly Churn Rate', benchmark: 'Or: ARPU × Gross Margin × Avg Customer Lifespan.' },
  { label: 'LTV/CAC', formula: 'LTV ÷ CAC', benchmark: 'Min 3x for SaaS. Below 1x = unsustainable. Above 5x = under-investing.' },
  { label: 'Payback Period', formula: 'CAC ÷ Monthly Gross Margin/Customer', benchmark: 'Under 12 months = healthy SaaS.' },
  { label: 'Anomaly', formula: 'Metric vs Mean ± nσ', benchmark: '2σ = investigate. 3σ = almost certainly real signal.' },
]

const GOLDEN_RULES = [
  'Correlation ≠ Causation. Only A/B tests establish causal effect.',
  'Every A/B test needs 1 primary metric + 2 guardrails.',
  'Never report aggregate metrics without segmentation.',
  'Drop-off priority = biggest drop% × average value. Fix highest revenue leak first.',
  'Underpowered tests produce false negatives. Always calculate sample size before running.',
  'p<0.05 without effect size is meaningless. A tiny lift with p=0.001 is still not worth shipping.',
]

const RETENTION_BENCHMARKS = [
  { type: 'Consumer / Social', d30: '20–25%' },
  { type: 'SaaS / B2B', d30: '50–70%' },
  { type: 'Gaming', d30: '10–15%' },
]

const PM_ANSWER_STEPS = [
  { step: 1, label: 'Clarify', action: 'What product? What time window? What metric baseline?' },
  { step: 2, label: 'Segment', action: 'Platform, geography, tenure, acquisition channel.' },
  { step: 3, label: 'Hypothesize', action: '3–4 possible causes ranked by probability.' },
  { step: 4, label: 'Validate', action: 'Which tool and visualization would confirm or deny each?' },
  { step: 5, label: 'Recommend', action: 'Data-backed action with expected impact and how to measure success.' },
]

// ─────────────────────────────────────────────
// DATA — APM Core 6 Stack (Right Sidebar)
// ─────────────────────────────────────────────

const APM_CORE_6 = [
  {
    rank: 1, concept: 'Funnel Analysis + Drop-off Diagnosis',
    coverage: 90, priority: 'very high',
    why: "The #1 APM question: 'something is dropping off, walk me through how you'd investigate.'",
    steps: ['Quantify drop at each step as %', 'Identify single biggest drop by volume × value', 'Segment by platform, device, channel, tenure', 'Hypothesize 3 causes ranked by probability', 'Propose validation (session replay, survey, A/B)', 'Recommend fix with expected impact'],
    example: 'Funnel: Homepage (100%) → Signup (42%) → Step 1 (38%) → Step 2 (21%) → Activation (14%). Biggest drop is Step 1→2 at 45%. Segment by platform — iOS drops harder: likely UI bug.',
    mistake: 'Naming funnel steps without prioritizing which drop to fix first, or not segmenting.',
    triggers: ['drop-off', 'conversion', 'abandonment'],
  },
  {
    rank: 2, concept: 'Retention Analysis + Cohort Thinking',
    coverage: 88, priority: 'very high',
    why: "'Retention dropped' is asked in every PM loop. Know what cohort comparison reveals.",
    steps: ['State D1/D7/D30 vs industry benchmark', 'Pull cohort chart — compare recent vs older cohorts', 'If newer cohorts worse: product regressed or channel changed', 'Segment by acquisition source to disentangle quality vs intent', 'Identify D7→D30 gap — the habit-formation window', 'Recommend intervention'],
    example: 'D30 dropped 28%→18%. Cohort chart: Jan at 28%, March at 18% — coincides with pricing change in Feb. New users are lower-intent. Paid users churn 2x faster than organic.',
    mistake: 'Looking at aggregate retention without cohort breakdown — misses mix-shift vs regression.',
    triggers: ['retention dropped', 'users not returning', 'cohort'],
  },
  {
    rank: 3, concept: 'A/B Testing Framework (end-to-end)',
    coverage: 85, priority: 'very high',
    why: 'Must state the full framework: hypothesis → metrics → sample size → runtime → ship decision.',
    steps: ['Hypothesis: If [X] then [Y] will improve by [Z%] because [reason]', 'Primary metric + 2 guardrail metrics', 'Sample size: baseline rate, MDE, α=0.05, power=80%', 'Min 2 weeks to cover weekly seasonality', 'Ship if p<0.05 AND CI fully above zero AND guardrails not broken'],
    example: 'Simplifying checkout step 2 will lift CVR by 3%. Guardrails: D7 retention, AOV. Need ~3,800 users/arm. Run 2 weeks. Ship if CI is [+1%, +5%].',
    mistake: "Saying 'run an A/B test' without specifying guardrails, sample size, or ship criteria.",
    triggers: ['experiment', 'test a feature', 'validate', 'rollout'],
  },
  {
    rank: 4, concept: 'Root Cause Analysis (metric anomaly)',
    coverage: 80, priority: 'high',
    why: "'DAU dropped 15% overnight — what do you do?' Needs a repeatable investigation structure.",
    steps: ['Rule out data issues: check pipeline, logging, instrumentation', 'Check magnitude: how many SDs from mean? 3σ = real', 'Segment to isolate: platform, geography, user segment', 'Correlate with events: deployments, outages, competitor launches', 'Hypothesize causes ranked by probability', 'Validate fastest hypothesis first, then act'],
    example: 'DAU dropped 12% Thursday. Data pipeline OK. 3.6σ below mean — real signal. iOS down 25%, Android flat. iOS build deployed Wednesday. Hot-fix immediately.',
    mistake: 'Jumping to product hypotheses without first ruling out data pipeline issues.',
    triggers: ['anomaly', 'sudden drop', 'spike', 'investigate'],
  },
  {
    rank: 5, concept: 'North Star Metric + Guardrail Metrics',
    coverage: 78, priority: 'high',
    why: "Every 'how would you measure success of X?' question requires this. Without guardrails you sound junior.",
    steps: ['Identify core value the product delivers to users', 'Define north star as the metric capturing that value at scale', 'Define 2 guardrails — one for UX, one for business health', 'Explain why the north star is leading (predicts future health)'],
    example: 'Food delivery app: north star = successful orders completed/week. Guardrails: delivery time (user experience) and restaurant partner retention (supply health).',
    mistake: 'Picking a vanity metric (signups, downloads, page views) or defining no guardrails.',
    triggers: ['measure success', 'metrics for X', 'define success'],
  },
  {
    rank: 6, concept: 'Segmentation as a Reflex',
    coverage: 95, priority: 'universal',
    why: 'Not a standalone tool — a habit applied to every answer. Aggregates hide opposing trends.',
    steps: ['Platform (iOS vs Android vs Web)', 'Geography (market, country, city tier)', 'User tenure (new <7d, growing 7-30d, retained 30+d)', 'Acquisition channel (paid, organic, referral)', 'User type (free vs paid, casual vs power)', 'Device type (mobile vs desktop)'],
    example: 'Overall DAU flat. Break by platform: web DAU -20%, mobile +35%. Product is shifting mobile-first. Break by tenure: new users -40%, retained flat — acquisition or onboarding problem.',
    mistake: 'Giving aggregate metric answers without segmentation — signals surface-level thinking.',
    triggers: ['any metric question', 'which users', 'why is X different'],
  },
]

const APM_DEPRIORITIZE = [
  { concept: 'LTV / CAC mechanics', why: 'More relevant for growth PM or senior PM — not core APM analytics' },
  { concept: 'P-value formula derivation', why: 'Know p<0.05 = significant; CI matters more — don\'t recite formula' },
  { concept: 'Variance / SD formula', why: 'Know the concept (2σ = anomaly) but don\'t derive it' },
  { concept: 'Power Analysis formula', why: 'Know the concept (need enough traffic to detect MDE) — calculators handle math' },
]

const APM_PRACTICE = [
  { q: 'DAU dropped 15% overnight. What do you do?', concepts: [4, 6] },
  { q: 'Checkout conversion fell 5% → 3%. Walk me through your analysis.', concepts: [1, 6] },
  { q: 'How would you measure success of a new notification feature?', concepts: [5, 6] },
  { q: 'We want to test a new onboarding flow. How would you design the experiment?', concepts: [3, 6] },
  { q: 'Retention dropped last month. How do you investigate?', concepts: [2, 4, 6] },
]

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-mono uppercase tracking-[0.10em] text-neutral-400 mb-3">
      {children}
    </div>
  )
}

function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'amber' | 'green' | 'red' | 'purple' }) {
  const styles: Record<string, string> = {
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    amber: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]',
    green: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]',
    red: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    purple: 'bg-[#FDF4FF] text-[#7E22CE] border-[#E9D5FF]',
  }
  return (
    <span className={`inline-block text-[9px] font-mono font-medium uppercase tracking-[0.08em] px-2 py-0.5 border rounded-none ${styles[color]}`}>
      {children}
    </span>
  )
}

function FormulaChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-mono text-[11px] text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] rounded-[4px] px-2.5 py-1 my-0.5">
      {children}
    </span>
  )
}

function MetricCard({ m }: { m: typeof METRICS[0] }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`border border-neutral-200 rounded-card bg-neutral-0 transition-all duration-base ${open ? 'border-l-[3px] border-l-brand-accent' : 'border-l-[3px] border-l-neutral-200 hover:border-l-brand-accent'}`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-semibold text-brand-navy min-w-[48px]">{m.name}</span>
          <span className="text-[11px] text-neutral-400 hidden sm:block">{m.full}</span>
        </div>
        {open ? <ChevronUp size={14} className="text-neutral-400 shrink-0" /> : <ChevronDown size={14} className="text-neutral-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-3 border-t border-neutral-100 pt-3">
          <p className="text-[12px] text-neutral-600 leading-relaxed">{m.def}</p>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">When to use</span>
            <p className="text-[12px] text-neutral-600">{m.when}</p>
          </div>
          <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg p-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-brand-accent block mb-1">Example Answer</span>
            <p className="text-[11px] text-neutral-600 italic leading-relaxed">"{m.example}"</p>
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-brand-danger block mb-1">Common Mistakes</span>
            <ul className="space-y-1">
              {m.mistakes.map((err, i) => (
                <li key={i} className="text-[11px] text-neutral-600 flex gap-1.5 items-start">
                  <span className="text-brand-danger mt-0.5 shrink-0">✕</span>
                  {err}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-wrap gap-1">
            {m.related.map(r => <Badge key={r} color="blue">{r}</Badge>)}
          </div>
        </div>
      )}
    </div>
  )
}
// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────

type Tab = 'metrics' | 'visualizations' | 'stats' | 'triggers' | 'formulas'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'metrics', label: 'Metrics', icon: BarChart2 },
  { id: 'visualizations', label: 'Visuals', icon: TrendingUp },
  { id: 'stats', label: 'Stat Tools', icon: FlaskConical },
  { id: 'triggers', label: 'If → Then', icon: Zap },
  { id: 'formulas', label: 'Formulas', icon: Hash },
]

export default function Cheatsheet() {
  const [activeTab, setActiveTab] = useState<Tab>('metrics')
  const [isApmFullscreen, setIsApmFullscreen] = useState(false)

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isApmFullscreen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isApmFullscreen])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <section className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
            PM Analytics Cheat Sheet
          </h1>
          <Badge color="amber">Quick Reference</Badge>
        </div>
        <p className="text-sm text-neutral-400 max-w-2xl">
          30+ analytics concepts — metrics, visualizations, statistical tools, and interview triggers.
          Use the <strong className="text-neutral-600">APM Core 6 Stack</strong> card in the right pane to expand APM-level concepts.
        </p>
      </section>

      {/* Two-column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5 items-start">

        {/* ── LEFT: Main Cheatsheet ── */}
        <div className="space-y-5 cheatsheet-main-content">

          {/* Tab Bar */}
          <div className="flex gap-1 flex-wrap">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 h-8 text-[11px] font-display font-semibold transition-all duration-fast focus:outline-none rounded-none cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-brand-navy text-neutral-0 border border-brand-navy'
                      : 'bg-neutral-0 text-neutral-600 border border-neutral-300 hover:border-brand-navy hover:text-brand-navy'
                  }`}
                >
                  <Icon size={13} />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* ── Metrics Tab ── */}
          {activeTab === 'metrics' && (
            <div className="space-y-2">
              <SectionLabel>Core Metrics (click to expand)</SectionLabel>
              <div className="space-y-2">
                {METRICS.map(m => <MetricCard key={m.name} m={m} />)}
              </div>

              {/* Retention Benchmarks inlined */}
              <div className="bg-neutral-0 border border-neutral-200 rounded-card p-4 mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-brand-accent" />
                  <h3 className="text-[13px] font-display font-bold text-neutral-900">Retention Benchmarks (D30)</h3>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {RETENTION_BENCHMARKS.map(b => (
                    <div key={b.type} className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg p-3 text-center space-y-1">
                      <FormulaChip>{b.d30}</FormulaChip>
                      <div className="text-[10px] text-neutral-400">{b.type}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400 italic">
                  📈 PMF signal: Retention curve flattens = product-market fit achieved.
                </p>
              </div>
            </div>
          )}

          {/* ── Visualizations Tab ── */}
          {activeTab === 'visualizations' && (
            <div className="space-y-2">
              <SectionLabel>Chart Selection Guide</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VISUALIZATIONS.map(v => (
                  <div
                    key={v.name}
                    className="bg-neutral-0 border border-neutral-200 rounded-card p-4 space-y-2 border-l-[3px] border-l-brand-accent"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-brand-accent" />
                      <span className="text-[13px] font-display font-bold text-neutral-900">{v.name}</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 leading-relaxed">{v.when}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {v.trigger.map(t => (
                        <span key={t} className="text-[9px] font-mono bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-2 py-0.5">
                          "{t}"
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart quick-pick */}
              <div className="bg-neutral-0 border border-neutral-200 rounded-card p-4 mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-brand-punch" />
                  <h3 className="text-[13px] font-display font-bold text-neutral-900">Chart Quick-Pick</h3>
                </div>
                <div className="space-y-1.5">
                  {[
                    ['Show change over time', 'Line Chart'],
                    ['Compare categories', 'Bar Chart'],
                    ['Find where users drop', 'Funnel Chart'],
                    ['Track retention by group', 'Cohort Chart / Retention Curve'],
                    ['Show 2D density / time patterns', 'Heatmap'],
                    ['Find correlation / outliers', 'Scatter Plot'],
                    ['Show user path / flow', 'Sankey Diagram'],
                  ].map(([goal, chart]) => (
                    <div key={goal} className="flex items-center gap-2 text-[12px]">
                      <span className="text-neutral-500 flex-1">{goal}</span>
                      <span className="font-mono text-[11px] text-brand-accent font-semibold">→ {chart}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Statistical Tools Tab ── */}
          {activeTab === 'stats' && (
            <div className="space-y-2">
              <SectionLabel>Statistical Tools</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {STAT_TOOLS.map(t => (
                  <div key={t.name} className="bg-neutral-0 border border-neutral-200 rounded-card p-4 space-y-2 hover:border-brand-accent transition-colors duration-fast">
                    <div className="flex items-center gap-2">
                      <FlaskConical size={13} className="text-brand-accent" />
                      <span className="text-[13px] font-display font-bold text-neutral-900">{t.name}</span>
                    </div>
                    <p className="text-[12px] text-neutral-600 leading-relaxed">{t.def}</p>
                  </div>
                ))}
              </div>

              {/* PM Answer Structure */}
              <div className="bg-neutral-0 border border-neutral-200 rounded-card p-4 mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <Target size={14} className="text-brand-positive" />
                  <h3 className="text-[13px] font-display font-bold text-neutral-900">PM Answer Structure (any metric question)</h3>
                </div>
                <div className="space-y-2">
                  {PM_ANSWER_STEPS.map(s => (
                    <div key={s.step} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-brand-navy text-neutral-0 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                        {s.step}
                      </div>
                      <div>
                        <span className="text-[12px] font-display font-bold text-neutral-900">{s.label} </span>
                        <span className="text-[12px] text-neutral-600">— {s.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── If → Then Triggers Tab ── */}
          {activeTab === 'triggers' && (
            <div className="space-y-2">
              <SectionLabel>If interviewer says X → Use Y</SectionLabel>
              <div className="space-y-2">
                {TRIGGERS.map(t => (
                  <div key={t.says} className="bg-neutral-0 border border-neutral-200 rounded-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2 sm:w-[40%] shrink-0">
                      <Zap size={13} className="text-brand-punch shrink-0" />
                      <span className="text-[12px] font-display font-semibold text-neutral-800 italic">"{t.says}"</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pl-5 sm:pl-0">
                      {t.use.map(u => (
                        <span key={u} className="text-[10px] font-mono bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] px-2 py-0.5">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Formulas Tab ── */}
          {activeTab === 'formulas' && (
            <div className="space-y-2">
              <SectionLabel>Key Formulas & Benchmarks</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FORMULAS.map(f => (
                  <div key={f.label} className="bg-neutral-0 border border-neutral-200 rounded-card p-4 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">{f.label}</span>
                    <FormulaChip>{f.formula}</FormulaChip>
                    <p className="text-[12px] text-neutral-600 leading-relaxed">{f.benchmark}</p>
                  </div>
                ))}
              </div>

              {/* Golden Rules */}
              <div className="bg-neutral-0 border border-neutral-200 rounded-card p-4 mt-2 space-y-3">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-brand-punch" />
                  <h3 className="text-[13px] font-display font-bold text-neutral-900">Golden Rules</h3>
                </div>
                <ul className="space-y-2">
                  {GOLDEN_RULES.map((rule, i) => (
                    <li key={i} className="flex gap-2.5 items-start text-[12px] text-neutral-600 leading-relaxed">
                      <span className="text-brand-punch font-mono font-bold text-[11px] mt-0.5 shrink-0">{i + 1}.</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT: Highlighted APM Preview Card ── */}
        <aside className="space-y-4 no-print">
          <div 
            onClick={() => setIsApmFullscreen(true)}
            className="bg-brand-navy rounded-card p-5 border border-brand-accent hover:border-brand-punch transition-all duration-base cursor-pointer relative overflow-hidden group text-white space-y-3 shadow-md shadow-blue-900/10 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-accent via-brand-punch to-brand-positive" />
            <div className="text-[9px] font-mono uppercase tracking-[0.12em] text-white/45 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-positive animate-pulse-dot" />
              APM / PM (0–2 YEARS)
            </div>
            <h2 className="text-[16px] font-display font-extrabold text-white leading-tight group-hover:text-brand-punch transition-colors duration-fast">
              APM Core 6 Stack
            </h2>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Covers ~85% of what APM interviews actually test. Click to expand full details, practice questions, and download as PDF.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1.5">
              <Badge color="green">FAANG</Badge>
              <Badge color="amber">Startup</Badge>
              <Badge color="blue">SaaS</Badge>
            </div>
            <div className="text-[11px] font-mono text-brand-punch font-semibold pt-2 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-fast">
              Expand Full Details →
            </div>
          </div>
        </aside>
      </div>

      {/* APM MODAL OVERLAY (Centered in the middle, covering cheatsheet info) */}
      {isApmFullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-neutral-900/60 backdrop-blur-sm apm-modal-backdrop">
          <div className="w-full max-w-5xl max-h-[85vh] bg-[#0B1E36] text-white rounded-card border border-white/10 flex flex-col shadow-2xl animate-fade-in relative apm-fullscreen-modal overflow-hidden">
            
            {/* Print specific style overrides */}
            <style>{`
              @media print {
                /* Hide AppShell elements, left cheatsheet column, and elements explicitly marked no-print */
                header,
                aside,
                .cheatsheet-main-content,
                .no-print {
                  display: none !important;
                }
                
                /* Reset root page body, root container, and main workspace boundaries */
                body,
                #root,
                main {
                  background: white !important;
                  color: black !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  height: auto !important;
                  min-height: 0 !important;
                  overflow: visible !important;
                  position: static !important;
                }
                
                /* Reformat fixed backdrop modal container as standard block */
                .apm-modal-backdrop {
                  position: static !important;
                  display: block !important;
                  background: transparent !important;
                  padding: 0 !important;
                  margin: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  overflow: visible !important;
                }
                
                /* Reformat dark fullscreen modal card for printing */
                .apm-fullscreen-modal {
                  position: static !important;
                  display: block !important;
                  width: 100% !important;
                  max-width: 100% !important;
                  height: auto !important;
                  max-height: none !important;
                  background: white !important;
                  color: black !important;
                  box-shadow: none !important;
                  border: none !important;
                  overflow: visible !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                
                /* Card formatting overrides */
                .apm-print-card {
                  background: white !important;
                  color: #111111 !important;
                  border: 1px solid #d1d5db !important;
                  page-break-inside: avoid !important;
                  margin-bottom: 1.5rem !important;
                  padding: 1.25rem !important;
                  box-shadow: none !important;
                }
                
                .apm-print-text {
                  color: #111111 !important;
                }
                
                .apm-print-muted {
                  color: #4b5563 !important;
                }
                
                .apm-print-badge {
                  background: #f3f4f6 !important;
                  color: #111111 !important;
                  border: 1px solid #9ca3af !important;
                }
            `}</style>

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 no-print">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-positive" />
                <h2 className="text-[16px] font-display font-extrabold text-white">APM Core 6 Stack Reference</h2>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-accent hover:bg-blue-600 transition-all text-xs font-display font-semibold cursor-pointer rounded-md text-white shadow-md shadow-blue-500/15"
                >
                  <Printer size={13} />
                  Download PDF
                </button>
                <button
                  onClick={() => setIsApmFullscreen(false)}
                  className="p-1.5 hover:bg-white/5 rounded-md text-white/60 hover:text-white transition-colors cursor-pointer"
                  title="Close Modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Content Panel */}
            <div className="overflow-y-auto p-6 md:p-9 space-y-8 flex-1">
              
              {/* Print-only Header */}
              <div className="hidden print:block border-b border-neutral-300 pb-4 mb-6">
                <h1 className="text-2xl font-extrabold text-neutral-900">APM Core 6 Stack Cheatsheet (0–2 Years)</h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Covers ~85% of what APM interviews actually test. Master these before anything else.
                </p>
              </div>

              {/* Immersive Modal Intro */}
              <div className="space-y-2 print:hidden">
                <div className="text-[10px] font-mono uppercase tracking-[0.15em] text-brand-punch flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-positive animate-pulse-dot" />
                  APM / PM (0–2 YEARS) INTERVIEW PREP
                </div>
                <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
                  APM Core 6 Stack
                </h1>
                <p className="text-sm text-white/60 max-w-2xl">
                  Covers ~85% of what APM interviews actually test. Master these before anything else.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge color="green">FAANG</Badge>
                  <Badge color="amber">Startup</Badge>
                  <Badge color="blue">SaaS</Badge>
                  <Badge color="purple">Growth Stage</Badge>
                </div>
              </div>

              {/* Full concepts expanded grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {APM_CORE_6.map((c) => {
                  const coverageColor = c.coverage >= 90 ? 'text-brand-positive' : c.coverage >= 80 ? 'text-brand-punch' : 'text-brand-accent'
                  const priorityBadge: 'green' | 'amber' | 'blue' | 'purple' = c.priority === 'very high' ? 'green' : c.priority === 'high' ? 'amber' : 'purple'

                  return (
                    <div key={c.rank} className="border border-white/10 bg-white/5 rounded-lg p-5 space-y-4 apm-print-card page-break-avoid">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xl font-bold text-brand-punch">{c.rank}</span>
                          <h3 className="text-base font-bold text-white apm-print-text">{c.concept}</h3>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <Badge color={priorityBadge}>{c.priority}</Badge>
                          <span className={`text-[10px] font-mono ${coverageColor} apm-print-text`}>{c.coverage}% of interviews</span>
                        </div>
                      </div>

                      {/* Why it's tested */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 apm-print-muted block">Why it's tested</span>
                        <p className="text-xs text-white/70 apm-print-text leading-relaxed">{c.why}</p>
                      </div>

                      {/* Answer Structure */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-brand-punch/70 apm-print-muted block">Answer Structure</span>
                        <ol className="space-y-1">
                          {c.steps.map((s, i) => (
                            <li key={i} className="text-xs text-white/80 apm-print-text flex gap-2 items-start leading-relaxed">
                              <span className="font-mono text-[10px] text-brand-punch/60 mt-0.5 shrink-0">{i + 1}.</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Example */}
                      <div className="bg-white/5 border border-white/5 rounded-md p-3.5 apm-print-card">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-brand-positive/70 apm-print-muted block mb-1">Example</span>
                        <p className="text-xs text-white/70 italic leading-relaxed apm-print-text">"{c.example}"</p>
                      </div>

                      {/* Common Mistakes */}
                      <div className="flex gap-2 items-start text-white/60 apm-print-muted">
                        <AlertCircle size={13} className="text-brand-danger shrink-0 mt-0.5" />
                        <p className="text-xs leading-relaxed">{c.mistake}</p>
                      </div>

                      {/* Triggers */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {c.triggers.map(t => (
                          <span key={t} className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 border border-white/10 apm-print-badge">
                            "{t}"
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Footer Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 page-break-avoid">
                {/* Practice Questions */}
                <div className="space-y-4 apm-print-card">
                  <h3 className="text-sm font-mono uppercase tracking-[0.10em] text-white/50 apm-print-muted">Rapid Practice Triggers</h3>
                  <div className="space-y-3">
                    {APM_PRACTICE.map((p, i) => (
                      <div key={i} className="border border-white/10 bg-white/5 rounded-md p-3.5 apm-print-card">
                        <p className="text-xs text-white/80 leading-relaxed apm-print-text">{p.q}</p>
                        <div className="flex gap-1 flex-wrap mt-2">
                          {p.concepts.map(n => (
                            <span key={n} className="text-[9px] font-mono text-brand-punch bg-brand-punch/10 border border-brand-punch/20 px-1.5 py-0.5 apm-print-badge">
                              #{n}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deprioritize Box */}
                <div className="space-y-4 apm-print-card">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-brand-danger shrink-0" />
                    <h3 className="text-sm font-mono uppercase tracking-[0.10em] text-white/50 apm-print-muted">What to Deprioritize at APM Level</h3>
                  </div>
                  <div className="space-y-3">
                    {APM_DEPRIORITIZE.map(d => (
                      <div key={d.concept} className="border-l-2 border-brand-danger/35 pl-3.5 space-y-1">
                        <div className="text-xs font-semibold text-white apm-print-text">{d.concept}</div>
                        <div className="text-xs text-white/50 leading-relaxed apm-print-muted">{d.why}</div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs italic text-white/30 border-t border-white/10 pt-3 apm-print-muted">
                    Learn these as depth when interviewers push back — not as primary answers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
