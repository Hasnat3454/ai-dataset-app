import { ExternalLink } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#1c1c35] py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-violet-600" />
          <span>AI Datasets Explorer — built on the Geo Knowledge Graph</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="https://geobrowser.io" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-400 transition-colors">
            <ExternalLink size={12} /> GeoBrowser
          </a>
          <a href="https://geobrowser.io/space/7429dfda5f14718fc6f603622bade857" target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-400 transition-colors">
            <ExternalLink size={12} /> Geo Space
          </a>
        </div>
      </div>
    </footer>
  )
}
