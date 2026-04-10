import rawData from '@/data/ai-datasets.json'

export interface Dataset {
  name: string
  description: string
  creator: string
  size: string
  data_formats: string
  licence: string
  web_url: string
  release_date: string
}

export const datasets: Dataset[] = rawData as Dataset[]

export function getYear(release_date: string): string {
  const parts = release_date?.trim().split(' ')
  return parts?.[parts.length - 1] ?? 'Unknown'
}

export function getFormats(data_formats: string): string[] {
  return data_formats
    .split(',')
    .map(f => f.trim())
    .filter(Boolean)
}

export function getLicenceGroup(licence: string): 'open' | 'limited' | 'restricted' {
  const l = licence.toLowerCase()
  if (l.includes('non-commercial') || l.includes('research only') || l.includes('credentialed') || l.includes('ldc')) return 'restricted'
  if (l.includes('various') || l.includes('custom') || l.includes('no explicit') || l.includes('no formal') || l.includes('unknown')) return 'limited'
  return 'open'
}

export function getStats() {
  const years = datasets.map(d => getYear(d.release_date)).filter(y => /^\d{4}$/.test(y))
  const creators = new Set(datasets.map(d => d.creator)).size
  const formats = new Set(datasets.flatMap(d => getFormats(d.data_formats))).size
  const yearMin = Math.min(...years.map(Number))
  const yearMax = Math.max(...years.map(Number))

  return {
    total: datasets.length,
    creators,
    formats,
    yearSpan: `${yearMin}–${yearMax}`,
  }
}

export function getFormatDistribution(): { name: string; value: number }[] {
  const counts: Record<string, number> = {}
  datasets.forEach(d => {
    getFormats(d.data_formats).forEach(f => {
      counts[f] = (counts[f] ?? 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([name, value]) => ({ name, value }))
}

export function getYearDistribution(): { year: string; count: number }[] {
  const counts: Record<string, number> = {}
  datasets.forEach(d => {
    const y = getYear(d.release_date)
    if (/^\d{4}$/.test(y)) counts[y] = (counts[y] ?? 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([year, count]) => ({ year, count }))
}

export function getLicenceDistribution(): { name: string; value: number; group: string }[] {
  const counts: Record<string, number> = {}
  datasets.forEach(d => {
    counts[d.licence] = (counts[d.licence] ?? 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value, group: getLicenceGroup(name) }))
}
