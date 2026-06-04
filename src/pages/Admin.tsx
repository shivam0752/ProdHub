import { useState, useRef } from 'react'
import { useAdmin } from '../hooks/useAdmin'
import { useFeedback } from '../hooks/useFeedback'
import type { ResourceSuggestion, Resource } from '../hooks/useResources'
import { ShieldCheck, Info, Check, X, Star, MessageSquare, Pencil, Trash2, Save, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

type Tab = 'suggestions' | 'resources' | 'feedback'

const TYPE_OPTIONS: Resource['type'][] = ['PRD', 'case_study', 'link', 'book']

interface EditState {
  title: string
  url: string
  description: string
  editorial_note: string
  type: Resource['type']
  tags: string
}

export default function Admin() {
  const {
    suggestions, loading: suggestionsLoading, error: suggestionsError,
    approveSuggestion, rejectSuggestion,
    resources, resourcesLoading,
    updateResource, deleteResource
  } = useAdmin()
  const { feedbackList, loading: feedbackLoading, error: feedbackError } = useFeedback()

  const [activeTab, setActiveTab] = useState<Tab>('resources')
  const [selectedSuggestion, setSelectedSuggestion] = useState<ResourceSuggestion | null>(null)
  const [editorialNote, setEditorialNote] = useState('')
  const [actioning, setActioning] = useState(false)
  const commentaryRef = useRef<HTMLDivElement>(null)

  // Resource editing
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editState, setEditState] = useState<EditState>({
    title: '', url: '', description: '', editorial_note: '', type: 'link', tags: ''
  })
  const [saving, setSaving] = useState(false)

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

  // Resource edit handlers
  const startEdit = (resource: Resource) => {
    setEditingId(resource.id)
    setEditState({
      title: resource.title,
      url: resource.url || '',
      description: resource.description || '',
      editorial_note: resource.editorial_note,
      type: resource.type,
      tags: (resource.tags || []).join(', ')
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleSave = async (id: string) => {
    if (!editState.title.trim() || !editState.editorial_note.trim()) {
      toast.error('Title and editorial note are required.')
      return
    }
    setSaving(true)
    try {
      await updateResource(id, {
        title: editState.title.trim(),
        url: editState.url.trim() || undefined,
        description: editState.description.trim() || undefined,
        editorial_note: editState.editorial_note.trim(),
        type: editState.type,
        tags: editState.tags ? editState.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      })
      toast.success('Resource updated!')
      setEditingId(null)
    } catch (err: any) {
      toast.error(err.message || 'Failed to update resource')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await deleteResource(id)
      toast.success('Resource deleted.')
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete resource')
    }
  }

  // Feedback metrics
  const feedbackWithRatings = feedbackList.filter(f => f.rating !== undefined && f.rating !== null)
  const avgRating = feedbackWithRatings.length > 0
    ? (feedbackWithRatings.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbackWithRatings.length).toFixed(1)
    : '0.0'

  const tabClass = (tab: Tab) =>
    `pb-3 px-4 text-[13px] font-bold border-b-2 transition-all duration-fast flex items-center gap-2 ${
      activeTab === tab
        ? 'border-brand-accent text-brand-navy'
        : 'border-transparent text-neutral-400 hover:text-neutral-600'
    }`

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
          Review community-submitted resources, edit or remove published content, and monitor user feedback in real-time.
        </p>
      </section>

      {/* Main Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Table/List Panel with Tab switching */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Headers */}
          <div className="flex border-b border-neutral-200 font-display">
            <button onClick={() => setActiveTab('resources')} className={tabClass('resources')}>
              <span>Manage Resources</span>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold ${
                activeTab === 'resources' ? 'bg-brand-navy text-neutral-0' : 'bg-neutral-100 text-neutral-400'
              }`}>{resources.length}</span>
            </button>
            <button onClick={() => setActiveTab('suggestions')} className={tabClass('suggestions')}>
              <span>Pending Suggestions</span>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold ${
                activeTab === 'suggestions' ? 'bg-brand-accent text-neutral-0' : 'bg-neutral-100 text-neutral-400'
              }`}>{suggestions.length}</span>
            </button>
            <button onClick={() => setActiveTab('feedback')} className={tabClass('feedback')}>
              <span>User Feedback</span>
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded-none font-bold ${
                activeTab === 'feedback' ? 'bg-brand-punch text-neutral-900' : 'bg-neutral-100 text-neutral-400'
              }`}>{feedbackList.length}</span>
            </button>
          </div>

          {/* ── SUGGESTIONS TAB ── */}
          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              {suggestionsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-neutral-100 border border-neutral-200 rounded-card animate-pulse"></div>
                  ))}
                </div>
              ) : suggestionsError ? (
                <div className="bg-brand-danger/10 border border-brand-danger p-4 text-brand-navy font-bold text-xs font-mono rounded-card">
                  Error fetching database suggestions: {suggestionsError}
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  {/* Mobile Card View */}
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
                              <a href={suggestion.url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-brand-accent hover:underline block break-all font-mono">
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
                          <button onClick={() => handleReject(suggestion.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-danger bg-brand-danger/5 hover:bg-brand-danger/10 border border-brand-danger/20 rounded-md font-semibold transition-all">
                            <X size={14} /><span>Reject</span>
                          </button>
                          <button onClick={() => handleApproveClick(suggestion)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-brand-positive bg-brand-positive/5 hover:bg-brand-positive/10 border border-brand-positive/20 rounded-md font-semibold transition-all">
                            <Check size={14} /><span>Review &amp; Approve</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
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
                          <tr key={suggestion.id}
                            className={`hover:bg-neutral-50/50 transition-colors duration-fast ${
                              selectedSuggestion?.id === suggestion.id ? 'bg-brand-accent/5' : ''
                            }`}>
                            <td className="p-3 space-y-1">
                              <div className="font-semibold text-neutral-900">{suggestion.title}</div>
                              {suggestion.url && (
                                <a href={suggestion.url} target="_blank" rel="noopener noreferrer"
                                  className="text-xs text-brand-accent hover:underline block truncate max-w-xs md:max-w-md font-mono">
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
                              <button onClick={() => handleApproveClick(suggestion)}
                                className="p-1.5 text-brand-positive hover:bg-brand-positive/10 border border-transparent rounded-md focus:outline-none"
                                title="Approve Submission"><Check size={16} /></button>
                              <button onClick={() => handleReject(suggestion.id)}
                                className="p-1.5 text-brand-danger hover:bg-brand-danger/10 border border-transparent rounded-md focus:outline-none"
                                title="Reject Submission"><X size={16} /></button>
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
          )}

          {/* ── MANAGE RESOURCES TAB ── */}
          {activeTab === 'resources' && (
            <div className="space-y-3">
              {resourcesLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 bg-neutral-100 border border-neutral-200 rounded-card animate-pulse"></div>
                  ))}
                </div>
              ) : resources.length === 0 ? (
                <div className="bg-neutral-50 border border-dashed border-neutral-200 p-8 text-center text-neutral-400 text-xs rounded-card">
                  No published resources found.
                </div>
              ) : (
                resources.map((resource) => (
                  <div key={resource.id}
                    className={`bg-neutral-0 border rounded-card transition-all duration-fast ${
                      editingId === resource.id ? 'border-brand-accent ring-1 ring-brand-accent/30' : 'border-neutral-200'
                    }`}>
                    {editingId === resource.id ? (
                      /* ── Edit Form ── */
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                          <span className="text-[10px] font-mono uppercase text-brand-accent font-bold tracking-widest">Editing Resource</span>
                          <button onClick={cancelEdit} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                            <X size={14} />
                          </button>
                        </div>

                        {/* Title + Type row */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="block text-[10px] font-medium text-neutral-500">Title <span className="text-brand-danger">*</span></label>
                            <input
                              type="text"
                              value={editState.title}
                              onChange={(e) => setEditState(s => ({ ...s, title: e.target.value }))}
                              className="w-full px-3 py-2 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all font-body text-neutral-800"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[10px] font-medium text-neutral-500">Type <span className="text-brand-danger">*</span></label>
                            <div className="relative">
                              <select
                                value={editState.type}
                                onChange={(e) => setEditState(s => ({ ...s, type: e.target.value as Resource['type'] }))}
                                className="w-full appearance-none px-3 py-2 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent transition-all font-body text-neutral-800 pr-8"
                              >
                                {TYPE_OPTIONS.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                            </div>
                          </div>
                        </div>

                        {/* URL */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-medium text-neutral-500">URL</label>
                          <input
                            type="url"
                            value={editState.url}
                            onChange={(e) => setEditState(s => ({ ...s, url: e.target.value }))}
                            className="w-full px-3 py-2 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all font-mono text-neutral-700"
                          />
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-medium text-neutral-500">Description</label>
                          <textarea
                            rows={2}
                            value={editState.description}
                            onChange={(e) => setEditState(s => ({ ...s, description: e.target.value }))}
                            className="w-full px-3 py-2 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all resize-none font-body text-neutral-800"
                          />
                        </div>

                        {/* Editorial Note */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-medium text-neutral-500">
                            Editorial Note <span className="text-brand-danger">*</span>
                          </label>
                          <textarea
                            rows={3}
                            value={editState.editorial_note}
                            onChange={(e) => setEditState(s => ({ ...s, editorial_note: e.target.value }))}
                            className="w-full px-3 py-2 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all resize-none font-body text-neutral-800"
                          />
                        </div>

                        {/* Tags */}
                        <div className="space-y-1">
                          <label className="block text-[10px] font-medium text-neutral-500">Tags <span className="text-neutral-400">(comma-separated)</span></label>
                          <input
                            type="text"
                            value={editState.tags}
                            onChange={(e) => setEditState(s => ({ ...s, tags: e.target.value }))}
                            placeholder="e.g. analytics, metrics, india-context"
                            className="w-full px-3 py-2 bg-neutral-0 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all font-body text-neutral-700"
                          />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-1">
                          <button onClick={cancelEdit}
                            className="flex-1 h-9 bg-neutral-0 border border-neutral-300 text-neutral-700 font-display font-semibold text-xs rounded-md hover:bg-neutral-50 transition-all">
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSave(resource.id)}
                            disabled={saving}
                            className="flex-1 h-9 bg-brand-navy text-neutral-0 font-display font-semibold text-xs rounded-md hover:bg-[#0b213c] transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                          >
                            {saving ? (
                              <div className="w-4 h-4 border-2 border-neutral-0 border-t-transparent animate-spin rounded-full" />
                            ) : (
                              <><Save size={13} /><span>Save Changes</span></>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ── Read View Row ── */
                      <div className="p-4 flex items-start gap-3">
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-neutral-900 text-sm truncate">{resource.title}</span>
                            <span className="font-mono text-[8px] font-bold bg-neutral-100 px-1.5 py-0.5 border border-neutral-200 uppercase rounded-none shrink-0">
                              {resource.type}
                            </span>
                          </div>
                          {resource.url && (
                            <a href={resource.url} target="_blank" rel="noopener noreferrer"
                              className="text-[11px] text-brand-accent hover:underline block truncate font-mono">
                              {resource.url}
                            </a>
                          )}
                          {resource.editorial_note && (
                            <p className="text-[11px] text-neutral-400 line-clamp-1 font-body italic">
                              "{resource.editorial_note}"
                            </p>
                          )}
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {resource.tags.map(tag => (
                                <span key={tag} className="text-[9px] font-mono bg-brand-accent/8 text-brand-accent border border-brand-accent/20 px-1.5 py-0.5 rounded-sm">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => startEdit(resource)}
                            className="p-1.5 text-neutral-400 hover:text-brand-accent hover:bg-brand-accent/8 border border-transparent rounded-md transition-all"
                            title="Edit resource"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(resource.id, resource.title)}
                            className="p-1.5 text-neutral-400 hover:text-brand-danger hover:bg-brand-danger/8 border border-transparent rounded-md transition-all"
                            title="Delete resource"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── FEEDBACK TAB ── */}
          {activeTab === 'feedback' && (
            <div className="space-y-4">
              {feedbackLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-neutral-100 border border-neutral-200 rounded-card animate-pulse"></div>
                  ))}
                </div>
              ) : feedbackError ? (
                <div className="bg-brand-danger/10 border border-brand-danger p-4 text-brand-navy font-bold text-xs font-mono rounded-card">
                  Error fetching feedback: {feedbackError}
                </div>
              ) : feedbackList.length > 0 ? (
                <div className="space-y-3">
                  {feedbackList.map((item) => (
                    <div key={item.id} className="bg-neutral-0 border border-neutral-200 p-4 rounded-card space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-neutral-900 text-[13px]">{item.name}</span>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {new Date(item.created_at).toLocaleString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                        </div>
                        {item.rating && (
                          <div className="flex items-center gap-1 bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 rounded-[4px]">
                            <Star size={12} className="text-brand-punch fill-brand-punch" />
                            <span className="font-mono text-[10px] text-brand-accent font-bold">{item.rating}/5</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed font-body whitespace-pre-wrap mt-1">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-50 border border-dashed border-neutral-200 p-8 text-center text-neutral-400 text-xs rounded-card">
                  No feedback submissions received yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div ref={commentaryRef} className="space-y-4">
          <h2 className="text-lg font-display font-bold text-neutral-900">
            {activeTab === 'suggestions' ? 'Approval Commentary'
              : activeTab === 'resources' ? 'Resource Editor'
              : 'Feedback Insights'}
          </h2>

          {activeTab === 'suggestions' ? (
            selectedSuggestion ? (
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
                  <span className="text-[10px] text-neutral-400 block">Curation is trust. Be opinionated and precise.</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setSelectedSuggestion(null)}
                    className="flex-1 h-9 bg-neutral-0 border border-neutral-300 text-neutral-800 font-display font-semibold text-xs rounded-md hover:bg-neutral-50 active:translate-y-[1px] transition-all duration-fast">
                    Cancel
                  </button>
                  <button onClick={handleConfirmApproval} disabled={actioning}
                    className="flex-1 h-9 bg-brand-navy text-neutral-0 font-display font-semibold text-xs rounded-md hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast disabled:opacity-50 flex items-center justify-center">
                    {actioning ? (
                      <div className="w-4 h-4 border-2 border-neutral-0 border-t-transparent animate-spin rounded-full"></div>
                    ) : 'Publish'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 border border-dashed border-neutral-200 p-6 text-center text-neutral-400 text-xs space-y-2 rounded-card">
                <Info className="mx-auto text-neutral-300" size={20} />
                <p>Select a pending suggestion row checkmark to write an editorial comment and publish the resource.</p>
              </div>
            )
          ) : activeTab === 'resources' ? (
            <div className="bg-neutral-50 border border-dashed border-neutral-200 p-6 text-center text-neutral-400 text-xs space-y-2 rounded-card">
              <Pencil className="mx-auto text-neutral-300" size={20} />
              <p>Click the <strong className="text-neutral-500">pencil icon</strong> on any resource row to open the inline editor, or the <strong className="text-neutral-500">trash icon</strong> to remove it permanently.</p>
            </div>
          ) : (
            /* Feedback Insights Sidebar */
            <div className="bg-neutral-0 border border-neutral-200 p-5 space-y-4 rounded-card">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-neutral-400">Overview</span>
                <h4 className="font-display font-bold text-sm text-neutral-900">Feedback Metrics</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-lg text-center space-y-1">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Total Submissions</div>
                  <div className="text-xl font-mono font-bold text-neutral-900">{feedbackList.length}</div>
                </div>
                <div className="bg-neutral-50 border border-neutral-100 p-3 rounded-lg text-center space-y-1">
                  <div className="text-[10px] font-mono uppercase text-neutral-400">Average Rating</div>
                  <div className="text-xl font-mono font-bold text-brand-punch flex items-center justify-center gap-1">
                    <span>{avgRating}</span>
                    <Star size={14} className="fill-brand-punch text-brand-punch" />
                  </div>
                </div>
              </div>
              <div className="bg-neutral-50 border border-neutral-100 p-3.5 rounded-lg space-y-2 text-xs text-neutral-500 font-body leading-relaxed">
                <div className="font-semibold text-neutral-700 flex items-center gap-1.5">
                  <MessageSquare size={14} className="text-brand-accent" />
                  Understanding User Sentiments
                </div>
                <p>
                  Use this feedback to discover which PM tools need clearer Swiggy/Zepto/Razorpay examples, which resume tips are working, and what resources to curate next.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
