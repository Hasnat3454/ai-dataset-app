import rawFallback from '@/data/ai-datasets.json'
import type { Dataset } from './datasets'

const SPACE_ID = '7429dfda5f14718fc6f603622bade857'
const GEO_API  = 'https://testnet-api.geobrowser.io/graphql'

interface GeoValue {
  property: { name: string | null }
  text:     string | null
  date:     string | null
}

interface GeoEntity {
  id:          string
  name:        string | null
  description: string | null
  valuesList:  GeoValue[]
}

function pickValue(values: GeoValue[], ...names: string[]): string | null {
  for (const name of names) {
    const v = values.find(v => v.property.name === name)
    if (v?.text) return v.text
    if (v?.date) return formatGeoDate(v.date)
  }
  return null
}

function formatGeoDate(iso: string): string {
  const clean = iso.replace('Z', '')
  const parts = clean.split('-')
  if (parts.length < 1) return iso
  return parts[0]
}

async function fetchPage(offset: number, size = 100): Promise<GeoEntity[]> {
  const query = `{
    entities(
      filter: { spaceIds: { anyEqualTo: "${SPACE_ID}" } }
      first: ${size}
      offset: ${offset}
    ) {
      id name description
      valuesList { property { name } text date }
    }
  }`

  const res = await fetch(GEO_API, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ query }),
  })

  if (!res.ok) throw new Error(`Geo API error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data?.entities ?? []
}

export async function fetchDatasetsFromGeo(): Promise<Dataset[]> {
  try {
    const all: GeoEntity[] = []
    let offset = 0
    const pageSize = 100

    while (true) {
      const page = await fetchPage(offset, pageSize)
      all.push(...page)
      if (page.length < pageSize) break
      offset += pageSize
    }

    // Only keep entities that look like datasets (have a description)
    const geoDatasets = all.filter(e => e.name && e.description)

    // Build a fallback lookup map from bundled JSON for fields not in Geo
    const fallbackMap = new Map<string, typeof rawFallback[0]>(
      (rawFallback as any[]).map((d: any) => [d.name.toLowerCase(), d])
    )

    return geoDatasets.map(e => {
      const vals = e.valuesList ?? []
      const name = e.name!

      const fallback = fallbackMap.get(name.toLowerCase())

      const webUrl = pickValue(vals, 'Web URL', 'Website', 'GitHub', 'Hugging Face') ?? fallback?.web_url ?? ''
      const releaseDate = pickValue(vals, 'Release date') ?? fallback?.release_date ?? ''
      const size = pickValue(vals, 'Size') ?? fallback?.size ?? ''
      const description = e.description ?? fallback?.description ?? ''

      return {
        name,
        description,
        creator:      fallback?.creator      ?? '',
        size,
        data_formats: fallback?.data_formats ?? '',
        licence:      fallback?.licence      ?? '',
        web_url:      webUrl,
        release_date: releaseDate,
      }
    })
  } catch (err) {
    console.warn('[geo-api] Falling back to bundled JSON:', err)
    return rawFallback as Dataset[]
  }
}
