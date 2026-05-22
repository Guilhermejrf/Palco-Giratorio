import type { ReactNode } from 'react'

interface TooltipProps {
  label: string
  children: ReactNode
}

export const Tooltip = ({ label, children }: TooltipProps) => (
  <span className="group relative inline-flex">
    {children}
    <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-charcoal)] px-2 py-1 text-xs text-white group-hover:block">
      {label}
    </span>
  </span>
)
