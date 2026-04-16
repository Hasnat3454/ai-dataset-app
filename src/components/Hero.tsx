'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Database, Users, FileCode2, CalendarRange, Wifi } from 'lucide-react'

interface Stats {
  total:    number
  creators: number
  formats:  number
  yearSpan: string
}

interface Props {
  stats:       Stats
  liveFromGeo: boolean
}

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef(false)

  useEffect(() => {
    if (ref.current) return
    ref.current = true
    const duration = 1400
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setValue(target)
    }
    setTimeout(() => requestAnimationFrame(step), 300)
  }, [target])

  return <>{value}{suffix}</>
}

export default function Hero({ stats, liveFromGeo }: Props) {
  const statItems = [
    { icon: Database,     label: 'Datasets',  value: stats.total,    suffix: '',  color: 'from-indigo-500 to-violet-500' },
    { icon: Users,        label: 'Creators',  value: stats.creators, suffix: '+', color: 'from-violet-500 to-purple-500' },
    { icon: FileCode2,    label: 'Formats',   value: stats.formats,  suffix: '',  color: 'from-purple-500 to-violet-600' },
  ]

  return (
    <section className="relative pt-32 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 rounded-full blur-[80px]" />
        <div className="absolute top-40 left-1/4 w-[200px] h-[200px] bg-violet-600/8 rounded-full blur-[60px]" />
        <div className="absolute top-30 right-1/4 w-[250px] h-[250px] bg-purple-600/6 rounded-full blur-[70px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-indigo-500/20 text-xs text-indigo-400 mb-6"
        >
          {liveFromGeo ? (
            <>
              <Wifi size={11} className="text-indigo-400" />
              Live from Geo Knowledge Graph · Testnet
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Published to Geo Knowledge Graph · Testnet
            </>
          )}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4"
        >
          Top <span className="text-gradient">AI Datasets</span>
          <br />on the Knowledge Graph
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 text-lg max-w-2xl mx-auto mb-12"
        >
          The most influential AI datasets — from NLP benchmarks to vision corpora —
          curated and published to{' '}
          <a href="https://geobrowser.io" target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">
            Geo
          </a>
          {' '}as an open knowledge graph.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {statItems.map(({ icon: Icon, label, value, suffix, color }) => (
            <div key={label} className="flex items-center gap-3 glass rounded-2xl px-5 py-3 border border-[#1c1c35] hover:border-indigo-500/30 transition-colors">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
                <Icon size={15} className="text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold text-white font-mono">
                  <AnimatedNumber target={value} suffix={suffix} />
                </div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 glass rounded-2xl px-5 py-3 border border-[#1c1c35] hover:border-indigo-500/30 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shrink-0">
              <CalendarRange size={15} className="text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold text-white font-mono">{stats.yearSpan}</div>
              <div className="text-xs text-slate-500">Year Range</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
