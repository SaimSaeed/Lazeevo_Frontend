// components/common/StatCard.tsx
"use client";
import { useTheme } from "@/context/themeContext";

interface StatCardProps {
  label:    string;
  value:    string | number;
  loading?: boolean;
}

export function StatCard({ label, value, loading = false }: StatCardProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`p-5 py-10 rounded-2xl border ${isDark ? "bg-[#111113] border-white/[0.07]" : "bg-white border-teal-100"}`}
      style={{
        boxShadow: isDark
          ? "0 2px 24px rgba(0,0,0,0.45)"
          : "0 2px 16px rgba(13,148,136,0.08)",
      }}
    >
      <p className={`text-xs font-medium mb-1 ${isDark ? "text-[#555]" : "text-[#999]"}`}>
        {label}
      </p>
      <p className="text-2xl font-extrabold text-teal-500"
        style={{ fontFamily: "'Syne', sans-serif" }}>
        {loading ? "—" : value}
      </p>
    </div>
  );
}