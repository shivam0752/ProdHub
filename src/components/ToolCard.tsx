import { useState } from 'react'
import type { Tool } from '../constants/tools'
import { ChevronDown, ChevronUp, Tag, Briefcase } from 'lucide-react'

interface ToolCardProps {
  tool: Tool
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Prioritization':
      return { bg: 'bg-[#FFFBEB]', text: 'text-[#B45309]', border: 'border-[#FDE68A]' }
    case 'Metrics':
      return { bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]', border: 'border-[#BFDBFE]' }
    case 'Frameworks':
      return { bg: 'bg-[#F0FDF4]', text: 'text-[#15803D]', border: 'border-[#BBF7D0]' }
    case 'Stakeholder Management':
      return { bg: 'bg-[#FDF4FF]', text: 'text-[#7E22CE]', border: 'border-[#E9D5FF]' }
    case 'PM Fundamentals':
    default:
      return { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' }
  }
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [expanded, setExpanded] = useState(false)
  const catStyle = getCategoryStyles(tool.category)

  return (
    <article 
      onClick={() => setExpanded(!expanded)}
      className="bg-neutral-0 border border-neutral-200 border-l-[3px] border-l-neutral-200 hover:border-l-brand-accent hover:border-[#BFDBFE] hover:translate-x-[2px] transition-all duration-base cursor-pointer rounded-card p-[18px] md:px-5 md:py-[18px] flex flex-col justify-between focus-within:ring-2 focus-within:ring-brand-accent focus-within:border-transparent select-none"
    >
      <div className="space-y-3">
        {/* Header containing Category badge and Chevron indicator */}
        <div className="flex items-center justify-between">
          <span className={`${catStyle.bg} ${catStyle.text} ${catStyle.border} font-mono text-[9px] font-medium uppercase tracking-[0.08em] px-2 py-0.75 rounded-none flex items-center gap-1.5 border`}>
            <Tag size={10} className="opacity-60" />
            {tool.category}
          </span>
          <button 
            type="button"
            className="text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse tool details" : "Expand tool details"}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-[15px] text-neutral-900 leading-snug">
          {tool.title}
        </h3>

        {/* Short preview of definition when collapsed, full definition when expanded */}
        <p className={`text-xs md:text-sm text-neutral-600 leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {tool.definition}
        </p>

        {/* Expandable Section */}
        <div 
          className={`overflow-hidden transition-all duration-base ${
            expanded ? 'max-h-[500px] opacity-100 mt-4 pt-4 border-t border-neutral-200' : 'max-h-0 opacity-0'
          }`}
        >
          {expanded && (
            <div className="space-y-4">
              {/* Plain English definition (complete read block) */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold">
                  Overview
                </h4>
                <p className="text-xs md:text-sm text-neutral-600 leading-relaxed font-body">
                  {tool.definition}
                </p>
              </div>

              {/* Concrete Indian Example Callout */}
              <div className="bg-neutral-50 border-l-[3px] border-brand-accent p-3.5 space-y-2">
                <h5 className="flex items-center gap-1.5 text-brand-navy font-display font-bold text-xs">
                  <Briefcase size={12} className="text-brand-accent" />
                  Indian Context Example
                </h5>
                <p className="text-xs text-neutral-600 leading-relaxed italic">
                  {tool.example}
                </p>
              </div>

              {/* Tactical Deep-Dive */}
              {tool.deep_dive && (
                <div className="bg-[#F9FAFB] border border-[#F3F4F6] rounded-lg p-3.5 space-y-1.5">
                  <h5 className="font-mono text-[9px] uppercase tracking-[0.10em] text-neutral-400 font-semibold">
                    Tactical Deep-Dive
                  </h5>
                  <p className="text-xs text-neutral-600 leading-relaxed font-body">
                    {tool.deep_dive}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Tap to expand callout instruction */}
      {!expanded && (
        <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-3 pt-2 border-t border-neutral-100 flex items-center justify-end">
          Click to read details
        </span>
      )}
    </article>
  )
}
