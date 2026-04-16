'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

interface Props {
  yearData:   { year: string; count: number }[]
  formatData: { name: string; value: number }[]
}

const FORMAT_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#7c3aed', '#818cf8', '#a78bfa', '#c4b5fd',
]

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass border border-[#2a2a4a] rounded-xl px-3 py-2 text-sm">
      <div className="text-slate-300 font-medium">{label ?? payload[0]?.name}</div>
      <div className="text-indigo-400 font-bold">{payload[0]?.value} datasets</div>
    </div>
  )
}

export default function Charts({ yearData, formatData }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
      >
        <div className="glass rounded-2xl border border-[#1c1c35] p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Datasets by Release Year</h3>
          <p className="text-xs text-slate-500 mb-5">Growth of influential AI datasets over time</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={yearData} barSize={14}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <XAxis dataKey="year" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-2xl border border-[#1c1c35] p-6">
          <h3 className="text-sm font-semibold text-slate-300 mb-1">Top Data Formats</h3>
          <p className="text-xs text-slate-500 mb-3">Distribution of formats across all datasets</p>
          {formatData.length > 0 ? (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie data={formatData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {formatData.map((_, i) => (
                    <Cell key={i} fill={FORMAT_COLORS[i % FORMAT_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{v}</span>} iconSize={8} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[210px] flex items-center justify-center text-slate-600 text-sm">No format data available</div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
