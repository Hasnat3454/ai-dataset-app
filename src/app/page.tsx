import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Charts from '@/components/Charts'
import Explorer from '@/components/Explorer'
import Footer from '@/components/Footer'

export default function Page() {
  return (
    <main className="min-h-screen bg-bg">
      <Navbar />
      <Hero />
      <Charts />
      <Explorer />
      <Footer />
    </main>
  )
}
