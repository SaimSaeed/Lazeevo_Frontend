// app/about/page.tsx
'use client'
import { useTheme } from '@/context/themeContext'
import { Shield, Star, Zap } from 'lucide-react'

const team = [
  { name: 'Ahmed Ali',  role: 'Founder & CEO',      emoji: '👨‍💼' },
  { name: 'Sara Khan',  role: 'Head of Design',      emoji: '👩‍🎨' },
  { name: 'Bilal Raza', role: 'Lead Engineer',       emoji: '👨‍💻' },
  { name: 'Fatima Mir', role: 'Customer Success',    emoji: '👩‍💼' },
]

const values = [
  {
    icon: Zap,
    title: 'Speed first',
    body: 'Every millisecond counts when a restaurant is busy. We obsess over performance.',
  },
  {
    icon: Shield,
    title: 'Built to last',
    body: 'Reliable software that works in low-connectivity environments. No excuses.',
  },
  {
    icon: Star,
    title: 'Fair pricing',
    body: 'PKR 1,000/month. No hidden fees. No tricks. Just honest software for local businesses.',
  },
]

export default function AboutPage() {
  const { isDark } = useTheme()

  return (
    <div className={`pt-16 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0c0c0e]' : 'bg-[#f0fafa]'}`}>
      <div className="max-w-4xl mx-auto px-6 py-24">

        {/* ── Hero ── */}
        <div className="text-center mb-20">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border mb-6 ${isDark ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-teal-50 border-teal-200 text-teal-600'}`}>
            🇵🇰 Made in Lahore, Pakistan
          </div>

          <h1
            className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-6 ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Built for{' '}
            <span className="text-teal-500">restaurants</span>
            <br />
            that never stop
          </h1>

          <p className={`text-base max-w-xl mx-auto leading-relaxed ${isDark ? 'text-[#555]' : 'text-[#888]'}`}>
            Lazeevo started in Lahore in 2025. We were frustrated by expensive,
            complicated POS systems that didn't work for local restaurants. So
            we built our own.
          </p>
        </div>

        {/* ── Values ── */}
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {values.map((v, i) => {
            const Icon = v.icon
            return (
              <div
                key={i}
                className={`group flex flex-col gap-4 p-7 rounded-2xl border transition-all duration-200 hover:scale-[1.01] ${
                  isDark
                    ? 'bg-[#111113] border-white/[0.07] hover:border-teal-500/30'
                    : 'bg-white border-black/[0.07] hover:border-teal-400/40'
                }`}
                style={{
                  boxShadow: isDark
                    ? '0 2px 24px rgba(0,0,0,0.45)'
                    : '0 2px 16px rgba(13,148,136,0.06)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-500/10 transition-transform duration-200 group-hover:scale-110">
                  <Icon size={22} strokeWidth={1.6} className="text-teal-500" />
                </div>
                <div>
                  <p
                    className={`font-bold text-base mb-1 ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {v.title}
                  </p>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-[#555]' : 'text-[#888]'}`}>
                    {v.body}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Team ── */}
        <div className="text-center mb-10">
          <h2
            className={`text-2xl font-extrabold tracking-tight mb-2 ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            The team
          </h2>
          <p className={`text-sm ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
            Small team. Big ambitions.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((m, i) => (
            <div
              key={i}
              className={`group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200 hover:scale-[1.02] ${
                isDark
                  ? 'bg-[#111113] border-white/[0.07] hover:border-teal-500/30'
                  : 'bg-white border-black/[0.07] hover:border-teal-400/40'
              }`}
              style={{
                boxShadow: isDark
                  ? '0 2px 24px rgba(0,0,0,0.45)'
                  : '0 2px 16px rgba(13,148,136,0.06)',
              }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-teal-500/10 transition-transform duration-200 group-hover:scale-110">
                {m.emoji}
              </div>
              <div className="text-center">
                <p className={`font-bold text-sm ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}>
                  {m.name}
                </p>
                <p className={`text-[11px] mt-0.5 ${isDark ? 'text-[#555]' : 'text-[#aaa]'}`}>
                  {m.role}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}