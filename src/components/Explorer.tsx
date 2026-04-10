'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import { datasets, getFormats, getYear } from '@/lib/datasets'
import SearchFilter, { type SortOption } from './SearchFilter'
import DatasetCard from './DatasetCard'

const fuse = new Fuse(datasets, {
  keys: ['name', 'description', 'creator', 'licence', 'data_formats'],
  threshold: 0.35,
  includeScore: true,
})

const ALL_FORMATS = (() => {
  const counts: Record<string, number> = {}
  datasets.forEach(d => getFormats(d.data_formats).forEach(f => { counts[f] = (counts[f] ?? 0) + 1 }))
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([f]) => f)
})()

const ALL_LICENCES = (() => {
  const counts: Record<string, number> = {}
  datasets.forEach(d => { counts[d.licence] = (counts[d.licence] ?? 0) + 1 })
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([l]) => l)
})()

export default function Explorer() {
  const [query, setQuery] = useState('')
  const [activeFormats, setActiveFormats] = useState<string[]>([])
  const [activeLicences, setActiveLicences] = useState<string[]>([])
  const [sort, setSort] = useState<SortOption>('default')

  function toggleFormat(f: string) {
    setActiveFormats(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  function toggleLicence(l: string) {
    setActiveLicences(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])
  }

  const results = useMemo(() => {
    let base = query
      ? fuse.search(query).map(r => r.item)
      : [...datasets]

    if (activeFormats.length > 0) {
      base = base.filter(d => {
        const fmts = getFormats(d.data_formats)
        return activeFormats.some(f => fmts.includes(f))
      })
    }

    if (activeLicences.length > 0) {
      base = base.filter(d => activeLicences.includes(d.licence))
    }

    if (sort === 'name') base.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'year_desc') base.sort((a, b) => Number(getYear(b.release_date)) - Number(getYear(a.release_date)))
    if (sort === 'year_asc') base.sort((a, b) => Number(getYear(a.release_date)) - Number(getYear(b.release_date)))

    return base
  }, [query, activeFormats, activeLicences, sort])

  return (
    <section id="explore">
      <SearchFilter
        query={query}
        onQuery={setQuery}
        activeFormats={activeFormats}
        onToggleFormat={toggleFormat}
        activeLicences={activeLicences}
        onToggleLicence={toggleLicence}
        sort={sort}
        onSort={setSort}
        allFormats={ALL_FORMATS}
        allLicences={ALL_LICENCES}
        resultCount={results.length}
      />

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {results.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm">No datasets match your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((dataset, i) => (
              <DatasetCard key={dataset.name} dataset={dataset} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
