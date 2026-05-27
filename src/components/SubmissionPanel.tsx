import React, { useState } from 'react'
import type { Resource } from '../hooks/useResources'
import { Plus, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface SubmissionPanelProps {
  onSubmit: (suggestion: {
    title: string
    url: string
    description: string
    type: Resource['type']
  }) => Promise<any>
}

export default function SubmissionPanel({ onSubmit }: SubmissionPanelProps) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    type: 'PRD' as Resource['type']
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.url.trim()) {
      newErrors.url = 'URL is required'
    } else {
      try {
        new URL(formData.url)
      } catch {
        newErrors.url = 'Enter a valid URL (starting with http:// or https://)'
      }
    }
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await onSubmit(formData)
      toast.success('Resource suggestion submitted successfully!')
      setFormData({
        title: '',
        url: '',
        description: '',
        type: 'PRD'
      })
      setOpen(false)
    } catch (err: any) {
      console.error('Error submitting resource:', err)
      toast.error(err.message || 'Failed to submit resource')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {/* Floating Toggle Button (Mobile & Desktop) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 h-9 bg-brand-navy text-neutral-0 font-display font-semibold text-xs hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast rounded-md border-none"
        >
          <Plus size={16} />
          <span>Suggest Resource</span>
        </button>
      )}

      {/* Slide-out Panel Overlay */}
      {open && (
        <>
          <div 
            className="fixed inset-0 bg-neutral-900/40 z-40 transition-opacity mt-[52px]"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed right-0 top-[52px] bottom-0 w-full sm:w-[400px] bg-neutral-0 border-l-[0.5px] border-neutral-200 z-50 p-6 flex flex-col justify-between overflow-y-auto animate-slide-in-right">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b-[0.5px] border-neutral-100 pb-3">
                <h3 className="font-display font-extrabold text-base text-neutral-900">Suggest a Resource</h3>
                <button 
                  onClick={() => setOpen(false)}
                  className="text-neutral-400 hover:text-neutral-900 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-accent"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form id="suggest-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor="title" className="block text-[11px] font-medium text-neutral-600">
                    Resource Title <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Swiggy Driver Payout Model Case Study"
                    className={`w-full h-10 px-3 bg-neutral-0 border rounded-lg text-sm focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast ${
                      errors.title ? 'border-brand-danger bg-red-50/10' : 'border-neutral-200'
                    }`}
                  />
                  {errors.title && (
                    <span className="text-xs text-brand-danger flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.title}
                    </span>
                  )}
                </div>

                {/* URL */}
                <div className="space-y-1.5">
                  <label htmlFor="url" className="block text-[11px] font-medium text-neutral-600">
                    URL / Link <span className="text-brand-danger">*</span>
                  </label>
                  <input
                    id="url"
                    type="text"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="e.g. https://example.com/casestudy"
                    className={`w-full h-10 px-3 bg-neutral-0 border rounded-lg text-sm focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast ${
                      errors.url ? 'border-brand-danger bg-red-50/10' : 'border-neutral-200'
                    }`}
                  />
                  {errors.url && (
                    <span className="text-xs text-brand-danger flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.url}
                    </span>
                  )}
                </div>

                {/* Resource Type */}
                <div className="space-y-1.5">
                  <label htmlFor="type" className="block text-[11px] font-medium text-neutral-600">
                    Type
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                    className="w-full h-10 px-3 bg-neutral-0 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast"
                  >
                    <option value="PRD">PRD</option>
                    <option value="case_study">Case Study</option>
                    <option value="book">Book</option>
                    <option value="link">Link</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label htmlFor="description" className="block text-[11px] font-medium text-neutral-600">
                    Brief Description <span className="text-brand-danger">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a quick explanation of what this resource is and why other PM fellows should read it."
                    className={`w-full p-3 bg-neutral-0 border rounded-lg text-sm focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast resize-none ${
                      errors.description ? 'border-brand-danger bg-red-50/10' : 'border-neutral-200'
                    }`}
                  />
                  {errors.description && (
                    <span className="text-xs text-brand-danger flex items-center gap-1">
                      <AlertCircle size={12} />
                      {errors.description}
                    </span>
                  )}
                </div>
              </form>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-neutral-100 pt-4 flex gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex-1 h-9 bg-neutral-0 border border-neutral-300 text-neutral-800 font-display font-semibold text-xs rounded-md hover:bg-neutral-50 active:translate-y-[1px] transition-all duration-fast"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="suggest-form"
                disabled={submitting}
                className="flex-1 h-9 bg-brand-navy text-neutral-0 font-display font-semibold text-xs rounded-md hover:bg-[#0b213c] active:translate-y-[1px] transition-all duration-fast disabled:opacity-50 flex items-center justify-center"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-neutral-0 border-t-transparent animate-spin rounded-full"></div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
