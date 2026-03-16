// components/Footer.tsx
'use client'
import { Github, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'
import { useTheme } from '@/context/themeContext'

const links = [
  { label: 'Home',      href: '/' },
  { label: 'Downloads', href: '/downloads' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
]

const socials = [
  { icon: Github,  href: 'https://github.com/lazeevo',  label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com/lazeevo', label: 'Twitter' },
  { icon: Mail,    href: 'mailto:hello@lazeevo.com',    label: 'Email' },
]

export default function Footer() {
  const { isDark } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className={`border-t transition-colors duration-300 ${isDark ? 'bg-[#0c0c0e] border-white/[0.07]' : 'bg-white border-teal-100'}`}>

      {/* ── Top section ── */}
<div className="mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10">

        {/* Brand col */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <span
              className="text-xl font-extrabold tracking-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span className="text-teal-500">Laz</span>
              <span className={isDark ? 'text-[#f0f0f4]' : 'text-[#111]'}>eevo</span>
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-white/[0.07] text-[#55555f]' : 'bg-teal-50 text-teal-400'}`}>
              v1.0.0
            </span>
          </Link>

          <p className={`text-sm leading-relaxed max-w-[220px] ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
            A fast, simple POS built for Pakistani restaurants. From Lahore with ❤️
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2 mt-1">
            {socials.map((s, i) => {
              const Icon = s.icon
              return (
                <a   // ← was missing
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                    isDark
                      ? 'bg-white/[0.05] text-[#555] hover:bg-teal-500/10 hover:text-teal-400'
                      : 'bg-teal-50 text-teal-400 hover:bg-teal-100 hover:text-teal-600'
                  }`}
                >
                  <Icon size={14} />
                </a>
              )
            })}
          </div>
        </div>

        {/* Links col */}
        <div className='flex items-start justify-end gap-20'>
        <div className="flex flex-col gap-3">
          <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${isDark ? 'text-[#444]' : 'text-[#bbb]'}`}>
            Navigation
          </p>
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm w-fit transition-all hover:translate-x-1 ${
                isDark
                  ? 'text-[#555] hover:text-teal-400'
                  : 'text-[#999] hover:text-teal-600'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Contact col */}
        <div className="flex flex-col gap-3 mr-10">
          <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${isDark ? 'text-[#444]' : 'text-[#bbb]'}`}>
            Contact
          </p>
          <a   // ← was missing
            href="mailto:hello@lazeevo.com"
            className={`text-sm w-fit transition-all hover:translate-x-1 ${isDark ? 'text-[#555] hover:text-teal-400' : 'text-[#999] hover:text-teal-600'}`}
          >
            hello@lazeevo.com
          </a>
          <a   // ← was missing
            href="https://twitter.com/lazeevo"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm w-fit transition-all hover:translate-x-1 ${isDark ? 'text-[#555] hover:text-teal-400' : 'text-[#999] hover:text-teal-600'}`}
          >
            @lazeevo
          </a>
          <p className={`text-sm ${isDark ? 'text-[#555]' : 'text-[#999]'}`}>
            Lahore, Pakistan 🇵🇰
          </p>
        </div>

      </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className={`border-t px-6 py-4 ${isDark ? 'border-white/[0.05]' : 'border-teal-50'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2">
          <p className={`text-xs ${isDark ? 'text-[#333]' : 'text-[#ccc]'}`}>
            © {year} Lazeevo. All rights reserved.
          </p>
        </div>
      </div>

    </footer>
  )
}