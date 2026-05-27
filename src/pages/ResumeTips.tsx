import { useState } from 'react'
import { FileText, AlertTriangle, Target, ShieldCheck, FileCode, Copy, Check, X, ExternalLink } from 'lucide-react'

const LATEX_TEMPLATE = `%-------------------------
% Resume in Latex
% Author : Aarav Mehta
% License : MIT
%------------------------

\\documentclass[letterpaper,10pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

% Adjust margins
\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1.0in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright

% Sections formatting
\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

% Ensure that generate pdf is machine readable/ATS parsable
\\pdfgentounicode=1

%-------------------------
% Custom commands
\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

%-------------------------------------------
%%%%%%  RESUME STARTS HERE  %%%%%%%%%%%%%%%%%%%%%%%%%%%%


\\begin{document}

%----------HEADING----------
\\begin{center}
    \\textbf{\\Huge \\scshape Aarav Mehta} \\\\ \\vspace{1pt}
    \\small Bengaluru, India $|$ \\href{mailto:aarav.mehta@email.com}{aarav.mehta@email.com} $|$ +91 98765 43210 $|$ \\href{https://linkedin.com/in/aaravmehta}{linkedin.com/in/aaravmehta}
\\end{center}


%-----------EDUCATION-----------
\\section{Education}
  \\resumeSubHeadingListStart
    \\resumeSubheading
      {NextLeap Product Management Fellowship}{Bengaluru, India}
      {Cohort 23}{May 2026}
      \\resumeItemListStart
        \\resumeItem{Structured immersion in user research, metrics definition, RICE prioritization, SQL dashboards, and product teardowns.}
      \\resumeItemListEnd
  \\resumeSubHeadingListEnd


%-----------EXPERIENCE-----------
\\section{Work Experience}
  \\resumeSubHeadingListStart

    \\resumeSubheading
      {TechOps Solutions}{Bengaluru, India}
      {Associate Project Lead / Software Engineer}{July 2024 -- Present}
      \\resumeItemListStart
        \\resumeItem{Accomplished a \\textbf{14\\% increase in checkout conversions} by designing and implementing a simplified UPI quick-checkout workflow, reducing payment completion steps from 4 to 2.}
        \\resumeItem{Led a cross-functional squad of 3 developers and 1 designer to optimize dark store inventory replenishment routines, \\textbf{reducing API latency by 180ms} (boosting backend execution speed by 25\\%).}
        \\resumeItem{Analyzed user cohort drop-offs using Mixpanel to identify a critical friction point during bank selection, \\textbf{saving INR 1.2L in customer support overhead} through real-time modal warning prompts.}
      \\resumeItemListEnd

    \\resumeSubheading
      {NextLeap PM Fellowship}{Bengaluru, India}
      {Product Teardown Projects (Portfolio)}{Jan 2026 -- April 2026}
      \\resumeItemListStart
        \\resumeItem{\\textbf{Swiggy Delivery Optimization Teardown}: Evaluated driver allocation models using the Kano framework; proposed a geofence batching algorithm to increase weekly order volume per driver by \\textbf{12\\%}.}
        \\resumeItem{\\textbf{Zepto Cart Abandonment Audit}: Designed a cart-level A/B test sequence targeting average order values (AOV) via progress bar rewards, leading to a hypothetical \\textbf{8\\% growth in margins}.}
      \\resumeItemListEnd

  \\resumeSubHeadingListEnd


%-----------SKILLS & TOOLS-----------
\\section{Skills \\& Tools}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{PM Competencies}{: RICE Prioritization, User Research, Journey Mapping, PRD Writing, A/B Testing} \\\\
     \\textbf{Analytics \\& Data}{: SQL, Mixpanel, Amplitude, Excel, Cohort Retention Tables} \\\\
     \\textbf{Design \\& Tech}{: Figma (Lo-fi Wireframing), API Basics, System Workflows}
    }}
 \\end{itemize}

\\end{document}
`

export default function ResumeTips() {
  const [showLatexModal, setShowLatexModal] = useState(false)
  const [copiedLatex, setCopiedLatex] = useState(false)

  const handleCopyLatex = () => {
    navigator.clipboard.writeText(LATEX_TEMPLATE)
    setCopiedLatex(true)
    setTimeout(() => setCopiedLatex(false), 2000)
  }
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <section className="space-y-2 border-b border-neutral-200 pb-5">
        <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
          PM Resume & Interview Tactics
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl">
          Actionable resume structures, keyword optimization, and strategic advice tailored to breaking into PM at Indian product startups.
        </p>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4 items-start">

        {/* Core Content: Structure and Keywords */}
        <div className="space-y-6 flex-1">

          {/* Section 1: India-Specific Market Realities */}
          <div className="bg-neutral-0 border border-neutral-200 p-5 md:p-6 space-y-4 rounded-card">
            <h2 className="text-[15px] font-display font-extrabold text-neutral-900 flex items-center gap-2">
              <Target className="text-brand-accent" size={20} />
              India-Specific vs US PM Hiring
            </h2>
            <div className="space-y-3 text-xs md:text-sm text-neutral-600 leading-relaxed font-body">
              <p>
                In the US, PM hiring often relies heavily on standardized product sense and execution rubrics (e.g. Meta's product sense interview). In India, the market is highly operational and transaction-heavy. Startups like **Swiggy, Zepto, and Blinkit** prioritize execution depth, system understanding, and quick turnarounds.
              </p>
              <p>
                <strong>The Execution Bias:</strong> Indian founders want to see that you can get your hands dirty. If you are an engineer or marketer transitioning into PM, do not talk about high-level strategy immediately. Highlight how you solved conversion drops, streamlined operations, or reduced API latencies.
              </p>
            </div>
          </div>

          {/* Section 2: Resume Structure Checklist */}
          <div className="bg-neutral-0 border border-neutral-200 p-5 md:p-6 space-y-4 rounded-card">
            <h2 className="text-[15px] font-display font-extrabold text-neutral-900 flex items-center gap-2">
              <ShieldCheck className="text-brand-positive" size={20} />
              The ASPIRING PM Resume Structure
            </h2>
            <div className="space-y-4 font-body">
              <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
                Keep it to a strict 1-page layout. Use the <span className="font-mono text-[11px] text-[#1D4ED8] bg-[#EFF6FF] border border-[#BFDBFE] rounded-[4px] px-2.5 py-1 inline-block my-1">X-Y-Z formula</span>: <em>"Accomplished [X] as measured by [Y], by doing [Z]."</em>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg p-4 space-y-2">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-neutral-900">
                    What to Include:
                  </h4>
                  <ul className="text-xs text-neutral-600 space-y-1.5 list-disc pl-4">
                    <li>Prioritized feature launches with direct business KPIs.</li>
                    <li>Experience working with developers, designers, and operations.</li>
                    <li>Product teardowns or cohort fellowship projects (like NextLeap).</li>
                    <li>SQL, analytics dashboards (Mixpanel/Amplitude), and prototyping skills.</li>
                  </ul>
                </div>

                <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg p-4 space-y-2">
                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-danger">
                    Common Mistakes to Avoid:
                  </h4>
                  <ul className="text-xs text-neutral-600 space-y-1.5 list-disc pl-4">
                    <li>"Responsible for the product roadmap" (too passive, show impact).</li>
                    <li>Listing every PM framework (Agile, Scrum, RICE) as a standalone skill.</li>
                    <li>US-centric templates with huge summary paragraphs.</li>
                    <li>Focusing on design without linking back to conversion/revenue.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Indian Company Specific Targets */}
          <div className="bg-neutral-0 border border-neutral-200 p-5 md:p-6 space-y-4 rounded-card">
            <h2 className="text-[15px] font-display font-extrabold text-neutral-900 flex items-center gap-2">
              <FileText className="text-brand-punch" size={20} />
              Startup Case Study Profiling
            </h2>

            <div className="space-y-4 font-body">
              <div className="border-l-[3px] border-brand-accent p-4 bg-neutral-50 space-y-1">
                <h4 className="font-display font-bold text-sm text-brand-navy">Swiggy & Instamart</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Focus on logistics, driver assignment models, and AOV (Average Order Value) mechanics. Detail customer retention cohorts and subscription systems (Swiggy One).
                </p>
              </div>

              <div className="border-l-[3px] border-brand-punch p-4 bg-neutral-50 space-y-1">
                <h4 className="font-display font-bold text-sm text-brand-navy">Zepto & Blinkit</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Focus on micro-warehousing operational efficiency. Real-time dark store replenishment, picking speed optimization, and inventory fill-rates are the gold standards here.
                </p>
              </div>

              <div className="border-l-[3px] border-brand-positive p-4 bg-neutral-50 space-y-1">
                <h4 className="font-display font-bold text-sm text-brand-navy">Razorpay & CRED</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Focus on transactional reliability, payment checkout drop-offs, developer onboarding, API documentation quality, and gamification mechanics.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Panel: Keywords & Verification */}
        <div className="space-y-4">
          <div className="bg-brand-navy text-neutral-0 p-[18px] rounded-card space-y-4 border-none">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-white/35 uppercase tracking-[0.10em] block">
                Keywords
              </span>
              <h3 className="font-display font-bold text-sm text-neutral-0">
                Recruiter Terms
              </h3>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="text-brand-punch uppercase tracking-[0.10em] block text-[9px] font-medium">Growth &amp; Metrics</span>
                <p className="text-neutral-0 font-semibold text-[12px]">CSAT, NPS, CAC, LTV, AOV, Funnel Conversion, Cohort Retention</p>
              </div>

              <div className="space-y-1 border-t border-white/10 pt-3">
                <span className="text-brand-punch uppercase tracking-[0.10em] block text-[9px] font-medium">Execution &amp; Data</span>
                <p className="text-neutral-0 font-semibold text-[12px]">A/B Testing, User Personas, SQL, Mixpanel, Amplitude, PRDs, Figma Prototyping</p>
              </div>

              <div className="space-y-1 border-t border-white/10 pt-3">
                <span className="text-brand-punch uppercase tracking-[0.10em] block text-[9px] font-medium">Stakeholders &amp; Ops</span>
                <p className="text-neutral-0 font-semibold text-[12px]">Agile Scrum, RACI Mapping, SLA compliance, Dark Store Operations</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3 text-[10px] italic text-white/35 leading-relaxed">
              * Note: Do not dump these keywords. Weave them into quantitative impact statements.
            </div>
          </div>

          <div className="bg-[#F9FAFB] border border-[#F3F4F6] p-5 space-y-3 rounded-lg font-body">
            <h4 className="font-display font-bold text-sm text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="text-brand-punch" size={16} />
              Pro Tip
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              When applying to Indian startups, instead of just sending your resume, send a **Product Teardown** (a 3-slide deck analyzing one core feature in their product, explaining why it fails or succeeds, and suggesting a design improvement). That gets you interviews instantly.
            </p>
          </div>
        </div>

      </section>

      {/* Resume Template Section */}
      <section className="bg-neutral-0 border border-neutral-200 p-5 md:p-7 rounded-card space-y-6 mt-6 md:mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 pb-4 gap-4">
          <div className="space-y-1">
            <h2 className="text-[17px] font-display font-extrabold text-neutral-900">
              Interactive Demo Resume Template
            </h2>
            <p className="text-xs text-neutral-400">
              A real-world illustration of the X-Y-Z formula and key terms tailored for Zepto, Swiggy, and Razorpay applications.
            </p>
          </div>
          <button
            onClick={() => setShowLatexModal(true)}
            className="neo-btn-primary h-9 px-4 text-xs flex items-center gap-1.5 shrink-0"
          >
            <FileCode size={15} />
            <span>LaTeX Source</span>
          </button>
        </div>

        {/* Demo Resume Paper sheet (styled to look like a premium document) */}
        <div className="bg-[#FAF9F5] border border-neutral-200 rounded-lg p-5 md:p-8 font-body space-y-6 text-neutral-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
          {/* Header */}
          <div className="text-center space-y-1.5 pb-2 border-b border-neutral-200">
            <h3 className="font-display font-bold text-xl text-neutral-950">Aarav Mehta</h3>
            <div className="text-[11px] font-mono text-neutral-500 flex flex-wrap justify-center gap-2 sm:gap-3">
              <span>Bengaluru, India</span>
              <span className="hidden sm:inline">•</span>
              <span>aarav.mehta@email.com</span>
              <span className="hidden sm:inline">•</span>
              <span>+91 98765 43210</span>
              <span className="hidden sm:inline">•</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-brand-accent hover:underline">linkedin.com/in/aaravmehta</a>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-1.5">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy border-b-[0.5px] border-neutral-200 pb-0.5">
              Education
            </h4>
            <div className="flex flex-col sm:flex-row justify-between text-xs font-semibold text-neutral-900 gap-1">
              <span>NextLeap Product Management Fellowship</span>
              <span className="font-mono text-neutral-500 text-[11px] sm:text-xs">Cohort 23 (May 2026)</span>
            </div>
            <p className="text-[11px] text-neutral-600 leading-relaxed">
              Structured immersion in user research, metrics definition, RICE prioritization, SQL dashboards, and product teardowns.
            </p>
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy border-b-[0.5px] border-neutral-200 pb-0.5">
              Work Experience
            </h4>

            {/* Role 1 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between text-xs gap-1">
                <span className="font-semibold text-neutral-950">Associate Project Lead / Software Engineer</span>
                <span className="font-mono text-neutral-500 text-[11px]">July 2024 – Present</span>
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">TechOps Solutions, Bengaluru</div>
              <ul className="list-disc pl-4 text-[11px] text-neutral-600 space-y-1.5 leading-relaxed">
                <li>
                  Accomplished a <strong>14% increase in checkout conversions</strong> by designing and implementing a simplified UPI quick-checkout workflow, reducing payment completion steps from 4 to 2.
                </li>
                <li>
                  Led a cross-functional squad of 3 developers and 1 designer to optimize dark store inventory replenishment routines, <strong>reducing API latency by 180ms</strong> (boosting backend execution speed by 25%).
                </li>
                <li>
                  Analyzed user cohort drop-offs using Mixpanel to identify a critical friction point during bank selection, <strong>saving ₹1.2L in customer support overhead</strong> through real-time modal warning prompts.
                </li>
              </ul>
            </div>

            {/* Role 2 */}
            <div className="space-y-1.5">
              <div className="flex flex-col sm:flex-row justify-between text-xs gap-1">
                <span className="font-semibold text-neutral-950">Product Teardown Projects (Portfolio)</span>
                <span className="font-mono text-neutral-500 text-[11px]">Jan 2026 – April 2026</span>
              </div>
              <div className="text-[11px] text-neutral-500 font-medium">NextLeap PM Fellowship</div>
              <ul className="list-disc pl-4 text-[11px] text-neutral-600 space-y-1.5 leading-relaxed">
                <li>
                  <strong>Swiggy Delivery Optimization Teardown</strong>: Evaluated driver allocation models using the Kano framework; proposed a geofence batching algorithm to increase weekly order volume per driver by <strong>12%</strong>.
                </li>
                <li>
                  <strong>Zepto Cart Abandonment Audit</strong>: Designed a cart-level A/B test sequence targeting average order values (AOV) via progress bar rewards, leading to a hypothetical <strong>8% growth in margins</strong>.
                </li>
              </ul>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-2">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-brand-navy border-b-[0.5px] border-neutral-200 pb-0.5">
              Skills & Tools
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] text-neutral-600 leading-relaxed">
              <div>
                <strong className="text-neutral-900 block mb-0.5">PM Competencies:</strong> RICE Prioritization, User Research, Journey Mapping, PRD Writing, A/B Testing
              </div>
              <div>
                <strong className="text-neutral-900 block mb-0.5">Analytics & Data:</strong> SQL, Mixpanel, Amplitude, Excel, Cohort Retention Tables
              </div>
              <div>
                <strong className="text-neutral-900 block mb-0.5">Design & Tech:</strong> Figma (Lo-fi Wireframing), API Basics, System Workflows
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LaTeX Code Modal */}
      {showLatexModal && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-neutral-900/50 backdrop-blur-xs z-50 transition-opacity"
            onClick={() => setShowLatexModal(false)}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-neutral-0 border border-neutral-200 rounded-card w-full max-w-3xl shadow-xl flex flex-col max-h-[85vh] animate-slide-in-right overflow-hidden">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 shrink-0">
                <div className="flex items-center gap-2">
                  <FileCode className="text-brand-accent" size={18} />
                  <h3 className="font-display font-extrabold text-sm sm:text-base text-neutral-900">
                    LaTeX Resume Template Source
                  </h3>
                </div>
                <button 
                  onClick={() => setShowLatexModal(false)}
                  className="text-neutral-400 hover:text-neutral-900 p-1.5 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all duration-fast cursor-pointer animate-fade-in"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-5 flex-1 font-body text-xs sm:text-sm text-neutral-600">
                
                {/* Intro / Action bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200 p-4 rounded-lg">
                  <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
                    Copy the standard 1-page ATS-friendly LaTeX source code below. You can compile this directly in <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-brand-accent font-semibold hover:underline inline-flex items-center gap-0.5">Overleaf <ExternalLink size={11} /></a>.
                  </p>
                  <button
                    onClick={handleCopyLatex}
                    className="neo-btn-primary h-8 px-3 text-xs flex items-center gap-1.5 self-start sm:self-center shrink-0"
                  >
                    {copiedLatex ? <Check size={14} className="text-brand-positive" /> : <Copy size={14} />}
                    <span>{copiedLatex ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>

                {/* Code Block */}
                <div className="relative">
                  <pre className="bg-neutral-900 text-neutral-100 font-mono text-[11px] leading-relaxed p-4 rounded-lg overflow-x-auto max-h-[300px] select-all scrollbar-thin">
                    <code>{LATEX_TEMPLATE}</code>
                  </pre>
                </div>

                {/* Pointers Section */}
                <div className="space-y-3 pt-2 border-t border-neutral-100">
                  <h4 className="font-display font-extrabold text-[13px] text-neutral-900 uppercase tracking-wider">
                    Pointers to compile & customize LaTeX code:
                  </h4>
                  <ul className="space-y-2.5 pl-4 list-decimal text-xs text-neutral-600 leading-relaxed">
                    <li>
                      <strong>Recommended Compiler:</strong> Paste this code into a new blank project on <a href="https://www.overleaf.com" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline inline-flex items-center gap-0.5">Overleaf.com <ExternalLink size={10} /></a>. Under "Menu" (top left in Overleaf), verify that your <strong>Compiler</strong> is set to <strong>pdfLaTeX</strong>.
                    </li>
                    <li>
                      <strong>ATS Optimization:</strong> The template includes the <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">glyphtounicode</code> utility. This embeds invisible text mappings into the PDF, ensuring Applicant Tracking Systems (ATS) can index and search your resume cleanly.
                    </li>
                    <li>
                      <strong>Character Escaping:</strong> LaTeX has special reserved characters. If you add text containing percentages, ampersands, or underscores, you must escape them: write <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">{"\\%"}</code>, <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">{"\\&"}</code>, and <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">{"\\_"}</code>.
                    </li>
                    <li>
                      <strong>Currency Formatting:</strong> To ensure cross-compiler compatibility without needing specialized local font packages, currency values like Rupees are formatted as <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">INR 1.2L</code> instead of using the raw <code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">₹</code> symbol.
                    </li>
                    <li>
                      <strong>Maintaining a 1-Page Layout:</strong> If your content starts spilling onto page 2, slightly adjust the top and bottom margins at the top of the file (<code className="bg-neutral-100 px-1 py-0.5 rounded font-mono text-[10px]">{"\\addtolength{\\topmargin}{-.5in}"}</code>) or reduce list spacing parameters.
                    </li>
                  </ul>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="border-t border-neutral-100 px-5 py-3.5 bg-neutral-50 flex justify-end shrink-0">
                <button
                  onClick={() => setShowLatexModal(false)}
                  className="neo-btn-secondary h-8 px-4 text-xs font-bold"
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  )
}
