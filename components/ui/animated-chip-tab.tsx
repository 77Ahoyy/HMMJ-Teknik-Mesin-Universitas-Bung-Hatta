'use client'

import React from 'react'
import { motion } from 'framer-motion'

export interface TabItem {
  id: string
  label: string
  count?: number
  icon?: React.ReactNode
}

export interface AnimatedChipTabProps {
  tabs: (string | TabItem)[]
  activeTab: string
  onTabChange: (tabId: string) => void
  layoutId?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function AnimatedChipTab({
  tabs,
  activeTab,
  onTabChange,
  layoutId = 'active-pill-indicator',
  className = '',
  size = 'md',
}: AnimatedChipTabProps) {
  const normalizedTabs: TabItem[] = tabs.map(tab => {
    if (typeof tab === 'string') {
      return { id: tab, label: tab }
    }
    return tab
  })

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  }

  return (
    <div
      className={`relative flex items-center gap-2 p-1.5 rounded-2xl bg-[#0c1524]/80 backdrop-blur-md border border-[rgba(201,168,76,0.18)] shadow-[0_8px_32px_rgba(0,0,0,0.36)] overflow-x-auto no-scrollbar max-w-full ${className}`}
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {normalizedTabs.map(tab => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center justify-center font-semibold transition-colors duration-200 rounded-xl select-none z-10 whitespace-nowrap cursor-pointer ${
              sizeClasses[size]
            } ${
              isActive
                ? 'text-[#070f1e] font-bold shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
            style={{
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            {/* Animated Pill Indicator */}
            {isActive && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#e8c97e] via-[#c9a84c] to-[#d4af37] shadow-[0_2px_14px_rgba(201,168,76,0.45)] -z-10"
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32,
                }}
              />
            )}

            {tab.icon && (
              <span className={`inline-flex items-center ${isActive ? 'text-[#070f1e]' : 'text-[#c9a84c]'}`}>
                {tab.icon}
              </span>
            )}

            <span>{tab.label}</span>

            {typeof tab.count === 'number' && (
              <span
                className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-colors ${
                  isActive
                    ? 'bg-[#070f1e]/20 text-[#070f1e]'
                    : 'bg-[#132238] text-[#c9a84c] border border-[rgba(201,168,76,0.2)]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default AnimatedChipTab
