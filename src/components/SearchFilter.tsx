'use client'

import { Search, X, SlidersHorizontal } from 'lucide-react'
import { clsx } from 'clsx'

export type SortOption = 'default' | 'name' | 'year_asc' | 'year_desc'

interface Props {
  query: string
  onQuery: (q: string) => void
  activeFormats: string[]
  onToggleFormat: (f: string) => void
  activeLicences: string[]
  onToggleLicence: (l: string) => void
  sort: SortOption
  onSort: (s: SortOption) => void
  allFormats: string[]
  allLicences: string[]
  resultCount: number
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'name', label: 'A–Z' },
  { value: 'year_desc', label: 'Newest' },
  { value: 'year_asc', label: 'Oldest' },
]

export default function SearchFilter({
  query, onQuery,
  activeFormats, onToggleFormat,
  activeLicences, onToggleLicence,
  sort, onSort,
  allFormats, allLicences,
  resultCount,
}: Props) {
  const hasFilters = query || activeFormats.length > 0 || activeLicences.length > 0

  function clearAll() {
    onQuery('')
    activeFormats.forEach(onToggleFormat)
    activeLicences.forEach(onToggleLicence)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search datasets, creators, descriptions…"
            value={query}
            onChange={e => onQuery(e.target.value)}
            className="w-full bg-[#0e0e1c] border border-[#1c1c35] rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#10102a] transition-all"
          />
          {query && (
            <button onClick={() => onQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} className="text-slate-500 shrink-0" />
          <div className="flex rounded-xl overflow-hidden border border-[#1c1c35]">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => onSort(opt.value)}
                className={clsx(
                  'px-3 py-2 text-xs transition-colors',
                  sort === opt.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[#0e0e1c] text-slate-500 hover:text-slate-300 hover:bg-[#13132a]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-slate-600 uppercase tracking-wider mr-1">Format</span>
          {allFormats.map(fmt => (
            <button
              key={fmt}
              onClick={() => onToggleFormat(fmt)}
              className={clsx(
                'text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all',
                activeFormats.includes(fmt)
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-[#0e0e1c] text-slate-500 border-[#1c1c35] hover:border-indigo-500/40 hover:text-slate-300'
              )}
            >
              {fmt}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[11px] text-slate-600 uppercase tracking-wider mr-1">Licence</span>
          {allLicences.map(lic => (
            <button
              key={lic}
              onClick={() => onToggleLicence(lic)}
              className={clsx(
                'text-[11px] font-medium px-2.5 py-1 rounded-full border transition-all',
                activeLicences.includes(lic)
                  ? 'bg-violet-600 text-white border-violet-500'
                  : 'bg-[#0e0e1c] text-slate-500 border-[#1c1c35] hover:border-violet-500/40 hover:text-slate-300'
              )}
            >
              {lic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Showing <span className="text-slate-300 font-medium">{resultCount}</span> datasets
          {hasFilters && ' matching filters'}
        </p>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>
    </div>
  )
}
