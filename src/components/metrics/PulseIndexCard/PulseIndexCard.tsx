import type { LucideIcon } from 'lucide-react'
import { Card } from '../../ui/Card/Card'

interface PulseIndexCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  delta?: string
}

export const PulseIndexCard = ({ icon: Icon, label, value, delta }: PulseIndexCardProps) => (
  <Card className="min-h-32" interactive={false}>
    <div className="mb-4 flex items-center justify-between">
      <Icon className="h-5 w-5 text-[var(--color-secondary-300)]" />
      {delta ? <span className="text-xs font-bold text-[var(--color-success)]">{delta}</span> : null}
    </div>
    <strong className="font-display text-3xl leading-none">{value}</strong>
    <p className="mt-2 text-sm text-[var(--color-warm-gray)]">{label}</p>
  </Card>
)
