import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface DebouncedSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDark?: boolean;
}

export const DebouncedSearch = ({ value, onChange, placeholder = "Search...", isDark }: DebouncedSearchProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 400);
    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all w-full max-w-md ${isDark ? "bg-[#111113] border-white/[0.08] focus-within:border-teal-500/50" : "bg-white border-black/[0.08] focus-within:border-teal-400/60"}`}>
      <Search size={16} className={isDark ? "text-[#555]" : "text-[#999]"} />
      <input
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className={`flex-1 text-sm outline-none bg-transparent ${isDark ? "text-white placeholder-[#444]" : "text-[#111] placeholder-[#bbb]"}`}
      />
      {localValue && (
        <button onClick={() => setLocalValue("")} className={`p-1 flex-shrink-0 rounded-md transition-colors ${isDark ? "text-[#555] hover:text-white hover:bg-white/[0.1]" : "text-[#999] hover:text-black hover:bg-black/[0.05]"}`}>
          <X size={14} />
        </button>
      )}
    </div>
  );
};
