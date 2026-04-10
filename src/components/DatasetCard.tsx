'use client'

import { motion } from 'framer-motion'
import { ExternalLink, HardDrive, Calendar, User } from 'lucide-react'
import { clsx } from 'clsx'
import type { Dataset } from '@/lib/datasets'
import { getFormats, getYear, getLicenceGroup } from '@/lib/datasets'

const FORMAT_COLORS: Record<string, string> = {
  JSON:    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  JSONL:   'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  CSV:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
  TSV:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
  Parquet: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  JPEG:    'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  PNG:     'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20',
  WAV:     'bg-purple-500/10 text-purple-400 border-purple-500/20',
  TXT:     'bg-indigo-500/8 text-indigo-400/70 border-indigo-500/15',
  Text:    'bg-indigo-500/8 text-indigo-400/70 border-indigo-500/15',
}

const LICENCE_STYLES: Record<string, string> = {
  open:       'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
  limited:    'bg-violet-500/15 text-violet-300 border-violet-500/25',
  restricted: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
}

export default function DatasetCard({ dataset, index }: { dataset: Dataset; index: number }) {
  const formats = getFormats(dataset.data_formats)
  const year = getYear(dataset.release_date)
  const licenceGroup = getLicenceGroup(dataset.licence)
  const licenceShort = dataset.licence.length > 22 ? dataset.licence.slice(0, 22) + '…' : dataset.licence

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.5) }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col rounded-2xl border border-[#1c1c35] bg-[#0e0e1c] hover:border-indigo-500/30 hover:bg-[#10102a] transition-colors duration-200 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 40px rgba(99,102,241,0.04)' }}
      />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-100 text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors">
            {dataset.name}
          </h3>
          <a
            href={dataset.web_url}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 mt-0.5 text-slate-600 hover:text-indigo-400 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={14} />
          </a>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 flex-1">
          {dataset.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {formats.slice(0, 3).map(fmt => (
            <span
              key={fmt}
              className={clsx(
                'text-[10px] font-medium px-2 py-0.5 rounded-full border',
                FORMAT_COLORS[fmt] ?? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
              )}
            >
              {fmt}
            </span>
          ))}
          {formats.length > 3 && (
            <span className="text-[10px] text-slate-600 px-1">+{formats.length - 3}</span>
          )}
        </div>

        <div className="pt-2 border-t border-[#1c1c35] flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <User size={10} className="shrink-0" />
            <span className="truncate">{dataset.creator}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <HardDrive size={10} className="shrink-0" />
                {dataset.size}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Calendar size={10} className="shrink-0" />
                {year}
              </div>
            </div>
            <span
              className={clsx(
                'text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0',
                LICENCE_STYLES[licenceGroup]
              )}
            >
              {licenceShort}
            </span>
          </div>
        </div>
      </div>

      <a
        href={dataset.web_url}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-400 border-t border-[#1c1c35] py-2.5 hover:bg-indigo-500/5 transition-all duration-200"
      >
        View Dataset <ExternalLink size={11} />
      </a>
    </motion.div>
  )
}
