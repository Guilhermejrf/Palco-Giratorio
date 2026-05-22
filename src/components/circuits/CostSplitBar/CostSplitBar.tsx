import type { CostShare } from '../../../types/circuit.types'
import { formatCurrency } from '../../../utils/formatters'

export const CostSplitBar = ({ shares }: { shares: CostShare[] }) => {
  const total = shares.reduce((sum, share) => sum + share.value, 0)
  return (
    <div>
      <div className="mb-4 flex h-5 overflow-hidden rounded-full bg-[var(--color-cream-dark)]">
        {shares.map((share) => (
          <span
            key={share.contractor}
            title={`${share.contractor}: ${formatCurrency(share.value)}`}
            style={{ width: `${(share.value / total) * 100}%`, backgroundColor: share.color }}
          />
        ))}
      </div>
      <div className="space-y-2">
        {shares.map((share) => (
          <div key={share.contractor} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: share.color }} />
              {share.contractor}
            </span>
            <strong>{formatCurrency(share.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  )
}
