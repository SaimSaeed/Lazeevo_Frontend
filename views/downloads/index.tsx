// app/downloads/page.tsx
'use client'
import { Apple, ArrowRight, Download, Globe, Monitor, MonitorDown } from 'lucide-react'
import { useTheme } from '@/context/themeContext'

const platforms = [
  { icon: Monitor,    label: 'Windows', sub: 'Windows 10 / 11',  version: 'v1.0.0', size: '82 MB', ext: '.exe' },
  { icon: Apple,      label: 'macOS',   sub: 'macOS 12+',         version: 'v1.0.0', size: '76 MB', ext: '.dmg' },
  { icon: MonitorDown,label: 'Linux',   sub: 'Ubuntu / Debian',   version: 'v1.0.0', size: '74 MB', ext: '.AppImage' },
]

export default function DownloadsPage() {
  const { isDark } = useTheme()

  return (
    <div className={`pt-16 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0c0c0e]' : 'bg-[#f0fafa]'}`}>
      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* Header */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border mb-6 ${isDark ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-teal-50 border-teal-200 text-teal-600'}`}>
            <Download size={12} />
            Free 14-day trial included
          </div>
          <h1
            className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Download{' '}
            <span className="text-teal-500">Lazeevo</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
            Available for all major platforms. Pick yours below.
          </p>
        </div>

        {/* Platform cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {platforms.map((p, i) => {
            const Icon = p.icon
            return (
              <div
                key={i}
                className={`group flex flex-col items-center gap-5 p-8 rounded-2xl border transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                  isDark
                    ? 'bg-[#111113] border-white/[0.07] hover:border-teal-500/30'
                    : 'bg-white border-black/[0.07] hover:border-teal-400/40'
                }`}
                style={{
                  boxShadow: isDark
                    ? '0 2px 24px rgba(0,0,0,0.45)'
                    : '0 2px 16px rgba(0,0,0,0.06)',
                }}
              >
                {/* Icon with accent line on hover */}
                <div className="relative w-full flex justify-center">
                  <div className="absolute -top-8 left-4 right-4 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-teal-500" />
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110 bg-teal-500/10">
                    <Icon size={28} strokeWidth={1.4} className="text-teal-500" />
                  </div>
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className={`font-bold text-lg ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {p.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-[#555]' : 'text-[#aaa]'}`}>{p.sub}</p>
                </div>

                {/* Meta pill */}
                <div className={`w-full text-center py-1.5 rounded-lg text-xs font-mono ${isDark ? 'bg-white/[0.04] text-[#555]' : 'bg-teal-50 text-teal-600/60'}`}>
                  {p.version} · {p.size} · {p.ext}
                </div>

                {/* Download button */}
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01] bg-teal-600 hover:bg-teal-700">
                  <Download size={15} />
                  Download
                </button>
              </div>
            )
          })}
        </div>

        {/* Web callout */}
        <div
          className={`flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl border transition-colors ${
            isDark
              ? 'bg-[#111113] border-white/[0.07]'
              : 'bg-white border-teal-100'
          }`}
          style={{
            boxShadow: isDark
              ? '0 2px 24px rgba(0,0,0,0.45)'
              : '0 2px 16px rgba(13,148,136,0.08)',
          }}
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-teal-500/10">
            <Globe size={26} strokeWidth={1.4} className="text-teal-500" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <p
              className={`font-bold text-lg ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Use in the browser
            </p>
            <p className={`text-sm mt-1 ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
              No installation needed. Access Lazeevo directly from any browser on any device.
            </p>
          </div>

          <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0 bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.02]">
            Open Web App <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  )
}