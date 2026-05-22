import type { LucideIcon } from 'lucide-react'
import { Button } from '../Button/Button'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle: string
  action?: string
  onAction?: () => void
}

export const EmptyState = ({ icon: Icon, title, subtitle, action, onAction }: EmptyStateProps) => (
  <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-cream-dark)] bg-white/60 p-8 text-center">
    <Icon className="mb-3 h-10 w-10 text-[var(--color-secondary-300)]" aria-hidden />
    <h2 className="font-display text-xl text-[var(--color-charcoal)]">{title}</h2>
    <p className="mt-1 max-w-md text-sm text-[var(--color-warm-gray)]">{subtitle}</p>
    {action ? (
      <Button className="mt-5" onClick={onAction}>
        {action}
      </Button>
    ) : null}
  </div>
)
