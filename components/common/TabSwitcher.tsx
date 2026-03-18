"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/context/themeContext";
import React from "react";

type TabsSwitcherProps = {
  tabs:          { label: string; value: string }[];
  defaultValue?: string;
  value?:        string;
  onChange?:     (value: string) => void;
  className?:    string;
};

export default function TabsSwitcher({
  tabs,
  defaultValue,
  value,
  onChange,
  className = "",
}: TabsSwitcherProps) {
  const { isDark } = useTheme();

  return (
    <Tabs
      defaultValue={defaultValue || tabs[0]?.value}
      value={value}
      onValueChange={(v) => onChange?.(v)}
      className={`w-full ${className}`}
    >
      <TabsList
        className={`p-1 h-[40px] rounded-xl flex gap-1 ${
          isDark ? "bg-white/[0.05]" : "bg-black/[0.05]"
        }`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`
              h-[32px] rounded-lg px-4 py-1.5 text-xs font-medium
              shadow-none transition-all duration-150
              ${isDark
                ? "text-[#555] data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                : "text-[#999] data-[state=active]:bg-teal-600 data-[state=active]:text-white"
              }
            `}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}