"use client"

import { useState } from "react"

interface Tab {
  id: string
  label: string
}

interface CaseTabsProps {
  tabs: Tab[]
  defaultValue?: string
  onChange?: (tabId: string) => void
}

export function CaseTabs({ tabs = [], defaultValue, onChange }: CaseTabsProps) {
  const firstTabId = tabs.length > 0 ? tabs[0].id : ""
  const [activeTab, setActiveTab] = useState(defaultValue || firstTabId)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  return (
    <div className="w-full">
      <div className="flex items-center border-b border-[#00000066]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`case-tab pt-2 pr-4 pb-3 pl-4 ${activeTab === tab.id ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
