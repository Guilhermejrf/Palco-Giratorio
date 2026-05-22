import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export const Badge = ({ children, className = '' }: BadgeProps) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${className}`}
  >
    {children}
  </span>
)
