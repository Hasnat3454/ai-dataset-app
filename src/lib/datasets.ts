import rawData from '@/data/ai-datasets.json'

export interface Dataset {
  name:         string
  description:  string
  creator:      string
  size:         string
  data_formats: string
  licence:      string
  web_url:      string
  release_date: string
}

export const datasets: Dataset[] = rawData as Dataset[]

export function getYear(release_date: string): string {
  const parts = release_date?.trim().split(/[\s\-]/)
  const year = parts?.find(p => /^\d{4}$/.test(p))
  return year ?? 'Unknown'
}

export function getFormats(data_formats: string): string[] {
  return (data_formats ?? '')
    .split(',')
    .map(f => f.trim())
    .filter(Boolean)
}

export function getLicenceGroup(licence: string): 'open' | 'limited' | 'restricted' {
  const l = licence.toLowerCase()
  if (l.includes('non-commercial') || l.includes('research only') || l.includes('credentialed') || l.includes('ldc')) return 'restricted'
  if (l.includes('various') || l.includes('custom') || l.includes('no explicit') || l.includes('no formal') || l.includes('unknown') || l === '') return 'limited'
  return 'open'
}

export function computeStats(data: Dataset[]) {
  const years    = data.map(d => getYear(d.release_date)).filter(y => /^\d{4}$/.test(y))
  const creators = new Set(data.map(d => d.creator).filter(Boolean)).size
  const formats  = new Set(data.flatMap(d => getFormats(d.data_formats))).size
  const nums     = years.map(Number).filter(n => !isNaN(n))
  const yearMin  = nums.length ? Math.min(...nums) : 0
  const yearMax  = nums.length ? Math.max(...nums) : 0

  return {
    total:    data.length,
    creators: creators || data.length,
    formats:  formats  || 10,
    yearSpan: yearMin && yearMax ? `${yearMin}–${yearMax}` : '—',
  }
}

export function computeYearDist(data: Dataset[]): { year: string; count: number }[] {
  const counts: Record<string, number> = {}
  data.forEach(d => {
    const y = getYear(d.release_date)
    if (/^\d{4}$/.test(y)) counts[y] = (counts[y] ?? 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year, count }))
}

export function computeFormatDist(data: Dataset[]): { name: string; value: number }[] {
  const counts: Record<string, number> = {}
  data.forEach(d => {
    getFormats(d.data_formats).forEach(f => {
      counts[f] = (counts[f] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }))
}

// Legacy exports for any remaining static usage
export function getStats() { return computeStats(datasets) }
export function getYearDistribution() { return computeYearDist(datasets) }
export function getFormatDistribution() { return computeFormatDist(datasets) }
