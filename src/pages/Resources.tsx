import { useState, useMemo } from 'react'
import { useResources } from '../hooks/useResources'
import ResourceCard from '../components/ResourceCard'
import SubmissionPanel from '../components/SubmissionPanel'
import { HelpCircle } from 'lucide-react'

export default function Resources() {
  const { resources, loading, error, submitSuggestion } = useResources()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (!selectedType) return true
      return resource.type === selectedType
    })
  }, [resources, selectedType])

  const typesMap = [
    { key: null, label: 'All Resources' },
    { key: 'PRD', label: 'PRDs' },
    { key: 'case_study', label: 'Case Studies' },
    { key: 'book', label: 'Books' },
    { key: 'link', label: 'Links' }
  ]

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Page Header block */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
            Curated Resources
          </h1>
          <p className="text-sm text-neutral-400 max-w-xl">
            A hand-picked library of PRDs, PM books, case studies, and helpful links containing mandatory editorial notes on why they are valuable.
          </p>
        </div>

        {/* Suggestion Panel Panel */}
        <div className="shrink-0">
          <SubmissionPanel onSubmit={submitSuggestion} />
        </div>
      </section>

      {/* Type Filter row */}
      <section className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {typesMap.map((type) => (
          <button
            key={type.label}
            onClick={() => setSelectedType(type.key)}
            className={`h-[27px] px-[12px] py-[5px] text-[11px] font-display font-semibold rounded-none tracking-[0.02em] transition-all duration-fast shrink-0 cursor-pointer border ${
              selectedType === type.key
                ? 'bg-brand-navy text-neutral-0 border-brand-navy'
                : 'bg-neutral-0 border-neutral-300 text-neutral-600 hover:border-brand-navy hover:text-brand-navy'
            }`}
          >
            {type.label}
          </button>
        ))}
      </section>

      {/* Grid Content Panel */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-neutral-100 border border-neutral-200 rounded-card animate-pulse"></div>
          ))}
        </div>
      ) : error && resources.length === 0 ? (
        <div className="bg-brand-danger/10 border border-brand-danger p-5 text-center text-brand-navy rounded-card">
          <p className="font-display font-bold text-sm">Failed to connect to database</p>
          <p className="text-xs text-neutral-600 mt-1">{error}</p>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      ) : (
        /* Empty Filter State */
        <div className="bg-neutral-50 border-2 border-dashed border-neutral-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto rounded-none">
            <HelpCircle size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-neutral-900">No resources found</h3>
            <p className="text-xs text-neutral-400">
              No approved resources have been cataloged in this category yet.
            </p>
          </div>
        </div>
      )}

      {/* Footer Info info */}
      {!loading && (
        <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between border-t border-neutral-100 pt-6">
          <span>Showing {filteredResources.length} of {resources.length} approved items</span>
          <span>Phase 3 Active</span>
        </div>
      )}
    </div>
  )
}
