import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Charts from '@/components/Charts'
import Explorer from '@/components/Explorer'
import Footer from '@/components/Footer'
import { fetchDatasetsFromGeo } from '@/lib/geo-api'
import { computeStats, computeYearDist, computeFormatDist } from '@/lib/datasets'

export default async function Page() {
  const datasets = await fetchDatasetsFromGeo()
  const stats = computeStats(datasets)
  const yearDist = computeYearDist(datasets)
  const formatDist = computeFormatDist(datasets)

  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero stats={stats} liveFromGeo />
      <Charts yearData={yearDist} formatData={formatDist} />
      <Explorer initialData={datasets} />
      <Footer />
    </main>
  )
}
