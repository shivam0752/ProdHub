import { useState, useRef } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import type { ResourceSuggestion } from '../hooks/useResources'
import { ShieldCheck, Info, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Admin() {
  const { suggestions, loading, error, approveSuggestion, rejectSuggestion } = useAdmin()
  const [selectedSuggestion, setSelectedSuggestion] = useState<ResourceSuggestion | null>(null)
  const [editorialNote, setEditorialNote] = useState('')
  const [actioning, setActioning] = useState(false)
  const commentaryRef = useRef<HTMLDivElement>(null)

  const handleApproveClick = (suggestion: ResourceSuggestion) => {
    setSelectedSuggestion(suggestion)
    setEditorialNote('')
    setTimeout(() => {
      commentaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const handleConfirmApproval = async () => {
    if (!selectedSuggestion) return
    if (!editorialNote.trim()) {
      toast.error('Editorial note is required before approving.')
      return
    }

    setActioning(true)
    try {
      await approveSuggestion(selectedSuggestion.id, editorialNote)
      toast.success('Resource approved and published!')
      setSelectedSuggestion(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to approve resource')
    } finally {
      setActioning(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!window.confirm('Are you sure you want to reject this suggestion?')) return

    try {
      await rejectSuggestion(id)
      toast.success('Suggestion rejected.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to reject suggestion')
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <section className="space-y-2 border-b border-neutral-200 pb-5">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-brand-accent" size={28} />
          <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
            Admin Dashboard
          </h1>
        </div>
        <p className="text-sm text-neutral-400 max-w-xl">
          Review community-submitted resources, provide mandatory editorial commentary, and approve them to go live in real-time.
        </p>
      </section>

      {/* Main Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Table of pending suggestions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-display font-bold text-neutral-900 flex items-center gap-2">
            <span>Pending Suggestions</span>
            <span className="bg-brand-punch text-neutral-900 font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold">
              {suggestions.length}
            </span>
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-neutral-100 border border-neutral-200 rounded-card animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-brand-danger/10 border border-brand-danger p-4 text-brand-navy font-bold text-xs font-mono rounded-card">
              Error fetching database suggestions: {error}
            </div>
          ) : suggestions.length > 0 ? (
            <>
              {/* Mobile Card View (hidden on md and above) */}
              <div className="block md:hidden space-y-3">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id}
                    className={`p-4 bg-neutral-0 border border-neutral-200 rounded-card space-y-3 transition-colors duration-fast ${
                      selectedSuggestion?.id === suggestion.id ? 'bg-brand-accent/5 ring-1 ring-brand-accent' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="font-semibold text-neutral-900 text-sm">{suggestion.title}</div>
                        {suggestion.url && (
                          <a 
                            href={suggestion.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-brand-accent hover:underline block break-all font-mono"
                          >
                            {suggestion.url}
                          </a>
                        )}
                        {suggestion.description && (
                          <p className="text-xs text-neutral-500 font-body">{suggestion.description}</p>
                        )}
                      </div>
                      <span className="font-mono text-[9px] font-medium bg-neutral-100 px-1.5 py-0.5 border border-neutral-200 uppercase rounded-none shrink-0">
                        {suggestion.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => handleReject(suggestion.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-danger bg-brand-danger/5 hover:bg-brand-danger/10 border border-brand-danger/20 rounded-md font-semibold transition-all"
                      >
                        <X size={14} />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApproveClick(suggestion)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-positive bg-brand-positive/5 hover:bg-brand-positive/10 border border-brand-positive/20 rounded-md font-semibold transition-all"
                      >
                        <Check size={14} />
                        <span>Review &amp; Approve</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View (hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto border border-neutral-200 bg-neutral-0 rounded-card">
                <table className="w-full border-collapse text-left text-sm font-body">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-400">
                      <th className="p-3">Resource Info</th>
                      <th className="p-3">Type</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {suggestions.map((suggestion) => (
                      <tr 
                        key={suggestion.id}
                        className={`hover:bg-neutral-50/50 transition-colors duration-fast ${
                          selectedSuggestion?.id === suggestion.id ? 'bg-brand-accent/5' : ''
                        }`}
                      >
                        <td className="p-3 space-y-1">
                          <div className="font-semibold text-neutral-900">{suggestion.title}</div>
                          {suggestion.url && (
                            <a 
                              href={suggestion.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-brand-accent hover:underline block truncate max-w-xs md:max-w-md font-mono"
                            >
                              {suggestion.url}
                            </a>
                          )}
                          {suggestion.description && (
                            <p className="text-xs text-neutral-400 line-clamp-1">{suggestion.description}</p>
                          )}
                        </td>
                        <td className="p-3">
                          <span className="font-mono text-[9px] font-medium bg-neutral-100 px-1.5 py-0.5 border border-neutral-200 uppercase rounded-none">
                            {suggestion.type}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-2 shrink-0">
                          <button
                            onClick={() => handleApproveClick(suggestion)}
                            className="p-1.5 text-brand-positive hover:bg-brand-positive/10 border border-transparent rounded-md focus:outline-none"
                            title="Approve Submission"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleReject(suggestion.id)}
                            className="p-1.5 text-brand-danger hover:bg-brand-danger/10 border border-transparent rounded-md focus:outline-none"
                            title="Reject Submission"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="bg-neutral-50 border border-dashed border-neutral-200 p-8 text-center text-neutral-400 text-xs rounded-card">
              All caught up! No pending resources to approve.
            </div>
          )}
        </div>

        {/* Editorial note overlay / sidebar prompt */}
        <div ref={commentaryRef} className="space-y-4">
          <h2 className="text-lg font-display font-bold text-neutral-900">
            Approval Commentary
          </h2>

          {selectedSuggestion ? (
            <div className="bg-neutral-0 border border-neutral-200 p-5 space-y-4 rounded-card">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Approving</span>
                <h4 className="font-display font-bold text-sm text-neutral-900">{selectedSuggestion.title}</h4>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="editorial-note" className="block text-[11px] font-medium text-neutral-600">
                  Mandatory Editorial Note <span className="text-brand-danger">*</span>
                </label>
                <textarea
                  id="editorial-note"
                  rows={4}
                  value={editorialNote}
                  onChange={(e) => setEditorialNote(e.target.value)}
                  placeholder="Explain in one sentence why this resource is useful and how PMs should apply it."
                  className="w-full p-3 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast resize-none font-body text-neutral-800"
                />
                <span className="text-[10px] text-neutral-400 block">
                  Curation is trust. Be opinionated and precise.
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="flex-1 h-9 bg-neutral-0 border border-neutral-300 text-neutral-800 font-display font-semibold text-xs rounded-md hover:bg-neutral-50 active:translate-y-[1px] transition-all duration-fast"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmApproval}
                  disabled={actioning}
                  className="flex-1 h-9 bg-brand-navy text-neutral-0 font-display font-semibold text-xs rounded-md hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast disabled:opacity-50 flex items-center justify-center"
                >
                  {actioning ? (
                    <div className="w-4 h-4 border-2 border-neutral-0 border-t-transparent animate-spin rounded-full"></div>
                  ) : (
                    'Publish'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 border border-dashed border-neutral-200 p-6 text-center text-neutral-400 text-xs space-y-2 rounded-card">
              <Info className="mx-auto text-neutral-300" size={20} />
              <p>Select a pending suggestion row checkmark to write an editorial comment and publish the resource.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
