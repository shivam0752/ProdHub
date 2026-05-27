import { useState, useMemo } from 'react'
import { useTools } from '../hooks/useTools'
import { CATEGORIES } from '../constants/tools'
import ToolCard from '../components/ToolCard'
import { Search, SlidersHorizontal, Info, X } from 'lucide-react'

export default function Tools() {
  const { tools, loading, error } = useTools()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter tools based on selected category and search input (name or description or example keyword)
  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesCategory = selectedCategory ? tool.category === selectedCategory : true
      
      const cleanQuery = searchQuery.trim().toLowerCase()
      const matchesSearch = cleanQuery
        ? tool.title.toLowerCase().includes(cleanQuery) ||
          tool.definition.toLowerCase().includes(cleanQuery) ||
          tool.example.toLowerCase().includes(cleanQuery) ||
          tool.category.toLowerCase().includes(cleanQuery)
        : true

      return matchesCategory && matchesSearch
    })
  }, [tools, selectedCategory, searchQuery])

  // Clear all filters action
  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Page Header block */}
      <section className="space-y-2 border-b border-neutral-200 pb-5">
        <h1 className="text-3xl font-display font-extrabold text-neutral-900 tracking-tight">
          Product Management Tools
        </h1>
        <p className="text-sm text-neutral-400 max-w-xl">
          A toolbox of frameworks, prioritization methods, and metric funnels mapped to concrete Indian startup examples.
        </p>
      </section>

      {/* Control bar: Search Input and Category Filter row */}
      <section className="space-y-4">
        {/* Search & Meta block */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
            <input 
              type="text"
              placeholder="Search by tool name or keyword (e.g. RICE, Swiggy, metric)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-[38px] pr-10 bg-neutral-0 border border-neutral-200 rounded-lg font-body text-[13px] text-neutral-800 placeholder-neutral-300 focus:outline-none focus:border-brand-accent focus:shadow-[0_0_0_3px_rgba(37,99,235,0.10)] transition-all duration-fast"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 focus:outline-none"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <span className="text-[11px] font-semibold text-neutral-400 flex items-center gap-1.5 mr-2 shrink-0">
            <SlidersHorizontal size={14} />
            Filter:
          </span>
          
          <button
            onClick={() => setSelectedCategory(null)}
            className={`h-[27px] px-[12px] py-[5px] text-[11px] font-display font-semibold rounded-none tracking-[0.02em] transition-all duration-fast shrink-0 cursor-pointer border ${
              selectedCategory === null
                ? 'bg-brand-navy text-neutral-0 border-brand-navy'
                : 'bg-neutral-0 border-neutral-300 text-neutral-600 hover:border-brand-navy hover:text-brand-navy'
            }`}
          >
            All Tools
          </button>

          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`h-[27px] px-[12px] py-[5px] text-[11px] font-display font-semibold rounded-none tracking-[0.02em] transition-all duration-fast shrink-0 cursor-pointer border ${
                selectedCategory === category
                  ? 'bg-brand-navy text-neutral-0 border-brand-navy'
                  : 'bg-neutral-0 border-neutral-300 text-neutral-600 hover:border-brand-navy hover:text-brand-navy'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Grid Content Panel */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-100 border border-neutral-200 rounded-card animate-pulse"></div>
          ))}
        </div>
      ) : error && tools.length === 0 ? (
        <div className="bg-brand-danger/10 border border-brand-danger p-5 text-center text-brand-navy rounded-card">
          <p className="font-display font-bold text-sm">Failed to connect to database</p>
          <p className="text-xs text-neutral-600 mt-1">{error}</p>
        </div>
      ) : filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] items-start">
          {filteredTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        /* Empty Search State */
        <div className="bg-neutral-50 border-2 border-dashed border-neutral-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto rounded-none">
            <Info size={24} />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-base text-neutral-900">No matching tools found</h3>
            <p className="text-xs text-neutral-400">
              Try adjusting your search query, selecting another category filter, or exploring different Indian company keywords.
            </p>
          </div>
          <button
            onClick={handleClearFilters}
            className="neo-btn-secondary h-8 px-4 text-xs font-bold"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Seed/Count Information Banner */}
      {!loading && (
        <div className="text-[11px] font-mono text-neutral-400 flex items-center justify-between border-t border-neutral-100 pt-6">
          <span>Showing {filteredTools.length} of {tools.length} available tools</span>
          <span>Phase 2 Active</span>
        </div>
      )}
    </div>
  )
}
