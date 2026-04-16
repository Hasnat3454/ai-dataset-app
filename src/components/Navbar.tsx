'use client'

import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-[#1c1c35]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-7 h-7 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs font-bold">
            AI
          </div>
          <span className="font-semibold text-slate-100 text-sm tracking-tight truncate">
            AI Datasets Explorer
          </span>
          <span className="hidden lg:inline text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            Geo Knowledge Graph
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="https://geobrowser.io"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ExternalLink size={13} />
            GeoBrowser
          </a>
        </div>
      </div>
    </motion.nav>
  )
}
