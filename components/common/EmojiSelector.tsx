import React, { useState } from "react";
import { useTheme } from "@/context/themeContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const EMOJIS = [
  "🍔", "🍕", "🌭", "🥪", "🌮", "🌯", "🥗", "🥘", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕", "🍵", "🥤", "🧋", "🧃", "🧉", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🍾", "🍶", "🧊", "🥄", "🍴", "🍽", "🥣", "🥡", "🥢", "🧂", "🌶", "🌽", "🥕", "🥑", "🍆", "🥔", "🍠", "🥐", "🥖", "🥨", "🥯", "🥞", "🧇", "🧀", "🍗", "🥩", "🥓", "🍳", "🥚"
];

interface EmojiSelectorProps {
  value: string;
  onChange: (emoji: string) => void;
}

export const EmojiSelector = ({ value, onChange }: EmojiSelectorProps) => {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex items-center justify-center w-12 h-12 rounded-xl border text-2xl transition-all hover:scale-[1.02] ${
            isDark
              ? "bg-[#0c0c0e] border-white/[0.08] text-white hover:border-white/[0.15]"
              : "bg-white border-black/[0.08] text-black hover:border-black/[0.15]"
          }`}
        >
          {value || "🍔"}
        </button>
      </PopoverTrigger>

      <PopoverContent 
        className={`w-64 p-2 rounded-2xl border shadow-xl ${
          isDark ? "bg-[#111113] border-white/[0.08]" : "bg-white border-black/[0.08]"
        }`}
        align="start"
      >
        <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onChange(emoji);
                setOpen(false);
              }}
              className={`text-xl p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                isDark ? "hover:bg-white/[0.1]" : "hover:bg-black/[0.05]"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
