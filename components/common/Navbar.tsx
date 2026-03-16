// components/Navbar.tsx
"use client";
import { Menu, X, LogIn, UserPlus, Moon, Sun } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCENT } from "@/lib/theme";
import { useTheme } from "@/context/themeContext";

const links = [
  { id: "home", label: "Home", href: "/home" },
  { id: "downloads", label: "Downloads", href: "/downloads" },
  { id: "about", label: "About", href: "/about" },
  { id: "contact", label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isDark, toggleMode } = useTheme();
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        isDark
          ? "bg-[#0c0c0e]/90 border-white/[0.07]"
          : "bg-white/90 border-black/[0.07]"
      }`}
      style={{ backdropFilter: "blur(16px)" }}
    >
      <div className="w-full px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span
            className="text-xl font-extrabold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span style={{ color: ACCENT }}>Laz</span>
            <span className={isDark ? "text-[#f0f0f4]" : "text-[#111113]"}>
              eevo
            </span>
          </span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive(l.href)
                  ? isDark
                    ? "bg-white/[0.08] text-white"
                    : "bg-teal-50 text-teal-600"
                  : isDark
                    ? "text-[#888] hover:text-white hover:bg-white/[0.05]"
                    : "text-[#777] hover:text-black hover:bg-black/[0.04]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Dark mode toggle */}
          <button
            onClick={toggleMode}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${
              isDark
                ? "bg-white/[0.07] text-white hover:bg-white/[0.12]"
                : "bg-black/[0.05] text-black hover:bg-black/[0.09]"
            }`}
          >
            {isDark ? <Sun size={16}/> : <Moon size={16}/>}
          </button>

               <Link
            href="/register"
            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] bg-teal-600 hover:bg-teal-700"
          >
            Sign In
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center ${
              isDark
                ? "bg-white/[0.07] text-white"
                : "bg-black/[0.05] text-black"
            }`}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className={`md:hidden border-t px-6 py-4 flex flex-col gap-1 ${
            isDark
              ? "bg-[#0c0c0e] border-white/[0.07]"
              : "bg-white border-black/[0.07]"
          }`}
        >
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive(l.href)
                  ? isDark
                    ? "bg-white/[0.08] text-white"
                    : "bg-teal-50 text-teal-600"
                  : isDark
                    ? "text-[#888] hover:text-white hover:bg-white/[0.05]"
                    : "text-[#777] hover:text-black hover:bg-black/[0.04]"
              }`}
            >
              {l.label}
            </Link>
          ))}

          <div className="flex gap-2 mt-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold border transition-all ${
                isDark
                  ? "border-teal-500/30 text-teal-400 hover:bg-teal-500/10"
                  : "border-teal-600/30 text-teal-600 hover:bg-teal-50"
              }`}
            >
              <LogIn size={14} />
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700"
            >
              <UserPlus size={14} />
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
