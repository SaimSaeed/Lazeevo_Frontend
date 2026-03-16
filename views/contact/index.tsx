// app/contact/page.tsx
'use client'
import { CheckCircle, Mail, Send, Twitter } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from '@/context/themeContext'

const contactInfo = [
  { label: 'Email',   value: 'hello@lazeevo.com', icon: Mail },
  { label: 'Twitter', value: '@lazeevo',           icon: Twitter },
]

export default function ContactPage() {
  const { isDark } = useTheme()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const input = `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 ${
    isDark
      ? 'bg-[#111113] border-white/[0.08] text-white placeholder-[#444] focus:border-teal-500/50 focus:ring-teal-500/10'
      : 'bg-white border-black/[0.08] text-black placeholder-[#ccc] focus:border-teal-400/50 focus:ring-teal-400/10'
  }`

  return (
    <div className={`pt-16 min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#0c0c0e]' : 'bg-[#f0fafa]'}`}>
      <div className="max-w-2xl mx-auto px-6 py-24">

        {/* ── Header ── */}
        <div className="text-center mb-14">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border mb-6 ${isDark ? 'bg-teal-500/10 border-teal-500/20 text-teal-400' : 'bg-teal-50 border-teal-200 text-teal-600'}`}>
            <Mail size={12} />
            We reply within 24 hours
          </div>
          <h1
            className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Get in <span className="text-teal-500">touch</span>
          </h1>
          <p className={`text-sm ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
            Have a question or want to get started? We'd love to hear from you.
          </p>
        </div>

        {/* ── Form card ── */}
        <div
          className={`p-8 rounded-2xl border transition-colors ${isDark ? 'bg-[#111113] border-white/[0.07]' : 'bg-white border-teal-100'}`}
          style={{
            boxShadow: isDark
              ? '0 2px 24px rgba(0,0,0,0.45)'
              : '0 2px 16px rgba(13,148,136,0.08)',
          }}
        >
          {sent ? (
            // ── Success state ──
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-teal-500/10">
                <CheckCircle size={32} className="text-teal-500" />
              </div>
              <p
                className={`font-bold text-xl ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                Message sent!
              </p>
              <p className={`text-sm ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                We'll get back to you shortly.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }) }}
                className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-all hover:scale-[1.02]"
              >
                Send another
              </button>
            </div>
          ) : (
            // ── Form ──
            <div className="flex flex-col gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-medium ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                    Name
                  </label>
                  <input
                    className={input}
                    placeholder="Ahmed Ali"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`text-xs font-medium ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                    Email
                  </label>
                  <input
                    className={input}
                    placeholder="ahmed@restaurant.com"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={`text-xs font-medium ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
                  Message
                </label>
                <textarea
                  className={`${input} resize-none`}
                  rows={5}
                  placeholder="Tell us about your restaurant..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                onClick={() => { if (form.name && form.email && form.message) setSent(true) }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] bg-teal-600 hover:bg-teal-700"
              >
                <Send size={15} />
                Send message
              </button>
            </div>
          )}
        </div>

        {/* ── Contact info ── */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {contactInfo.map((c, i) => {
            const Icon = c.icon
            return (
              <div
                key={i}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                  isDark
                    ? 'bg-[#111113] border-white/[0.07]'
                    : 'bg-white border-teal-100'
                }`}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-teal-500/10">
                  <Icon size={16} className="text-teal-500" />
                </div>
                <div>
                  <p className={`text-[10px] ${isDark ? 'text-[#555]' : 'text-[#aaa]'}`}>{c.label}</p>
                  <p className={`text-xs font-medium ${isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}`}>{c.value}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}