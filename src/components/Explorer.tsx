'use client'

import { useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Dataset } from '@/lib/datasets'
import { getFormats, getYear } from '@/lib/datasets'
import SearchFilter, { type SortOption } from './SearchFilter'
import DatasetCard from './DatasetCard'

interface Props {
  initialData: Dataset[]
}

export default function Explorer({ initialData }: Props) {
  const fuse = useMemo(() => new Fuse(initialData, {
    keys:      ['name', 'description', 'creator', 'licence', 'data_formats'],
    threshold: 0.35,
  }), [initialData])

  const ALL_FORMATS = useMemo(() => {
    const counts: Record<string, number> = {}
    initialData.forEach(d => getFormats(d.data_formats).forEach(f => { counts[f] = (counts[f] ?? 0) + 1 }))
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([f]) => f).filter(Boolean)
  }, [initialData])

  const ALL_LICENCES = useMemo(() => {
    const counts: Record<string, number> = {}
    initialData.forEach(d => { if (d.licence) counts[d.licence] = (counts[d.licence] ?? 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([l]) => l)
  }, [initialData])

  const [query,          setQuery]          = useState('')
  const [activeFormats,  setActiveFormats]  = useState<string[]>([])
  const [activeLicences, setActiveLicences] = useState<string[]>([])
  const [sort,           setSort]           = useState<SortOption>('default')

  function toggleFormat(f: string)  { setActiveFormats(p  => p.includes(f) ? p.filter(x => x !== f) : [...p, f]) }
  function toggleLicence(l: string) { setActiveLicences(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]) }

  const results = useMemo(() => {
    let base = query ? fuse.search(query).map(r => r.item) : [...initialData]

    if (activeFormats.length > 0)
      base = base.filter(d => activeFormats.some(f => getFormats(d.data_formats).includes(f)))

    if (activeLicences.length > 0)
      base = base.filter(d => activeLicences.includes(d.licence))

    if (sort === 'name')      base.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'year_desc') base.sort((a, b) => Number(getYear(b.release_date)) - Number(getYear(a.release_date)))
    if (sort === 'year_asc')  base.sort((a, b) => Number(getYear(a.release_date)) - Number(getYear(b.release_date)))

    return base
  }, [query, activeFormats, activeLicences, sort, fuse, initialData])

  return (
    <section id="explore">
      <SearchFilter
        query={query}           onQuery={setQuery}
        activeFormats={activeFormats}   onToggleFormat={toggleFormat}
        activeLicences={activeLicences} onToggleLicence={toggleLicence}
        sort={sort}             onSort={setSort}
        allFormats={ALL_FORMATS}
        allLicences={ALL_LICENCES}
        resultCount={results.length}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
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
