import type { Resource } from '../hooks/useResources'
import { logAnalyticsEvent } from '../lib/analytics'
import { ExternalLink, Book, Link2, FileText, Compass, Award } from 'lucide-react'

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getIconAndColor = (type: Resource['type']) => {
    switch (type) {
      case 'PRD':
        return { 
          label: 'PRD', 
          icon: FileText, 
          styles: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]' 
        }
      case 'case_study':
        return { 
          label: 'Case Study', 
          icon: Compass, 
          styles: 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]' 
        }
      case 'book':
        return { 
          label: 'Book', 
          icon: Book, 
          styles: 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0]' 
        }
      case 'link':
      default:
        return { 
          label: 'Link', 
          icon: Link2, 
          styles: 'bg-[#FDF4FF] text-[#7E22CE] border-[#E9D5FF]' 
        }
    }
  }

  const { label, icon: Icon, styles: badgeStyles } = getIconAndColor(resource.type)

  const handleLinkClick = async () => {
    await logAnalyticsEvent('resource_clicked', { 
      resourceId: resource.id, 
      title: resource.title,
      type: resource.type 
    })
  }

  return (
    <article className="bg-neutral-0 border border-neutral-200 hover:border-brand-accent hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_rgba(37,99,235,0.08)] transition-all duration-base p-5 flex flex-col justify-between rounded-card space-y-4">
      <div className="space-y-3">
        {/* Header - Type Badge & Meta info */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.75 rounded-none font-mono text-[9px] font-medium uppercase tracking-[0.08em] flex items-center gap-1.5 border ${badgeStyles}`}>
            <Icon size={10} className="opacity-60" />
            {label}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-[15px] text-neutral-900 leading-snug">
          {resource.title}
        </h3>

        {/* Description */}
        {resource.description && (
          <p className="text-xs md:text-sm text-neutral-600 leading-relaxed">
            {resource.description}
          </p>
        )}

        {/* Mandatory Editorial Note Callout */}
        <div className="bg-neutral-50 border-l-[3px] border-brand-punch p-3.5 space-y-1.5">
          <h5 className="flex items-center gap-1.5 text-brand-navy font-display font-bold text-xs uppercase tracking-wider">
            <Award size={13} className="text-brand-punch fill-brand-punch" />
            Why it belongs here
          </h5>
          <p className="text-xs md:text-sm text-neutral-600 leading-relaxed italic">
            "{resource.editorial_note}"
          </p>
        </div>
      </div>

      {/* Footer Link CTA */}
      {resource.url && (
        <div className="pt-2">
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-brand-accent hover:text-brand-navy focus:outline-none focus:underline"
          >
            <span>Open Resource</span>
            <ExternalLink size={13} />
          </a>
        </div>
      )}
    </article>
  )
}
