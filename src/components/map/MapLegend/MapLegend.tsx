import type { CityPulseStatus } from '../../../types/map.types'
import { cityStatusColor, pulseLabel } from '../../../utils/colorUtils'

const statuses: CityPulseStatus[] = ['off', 'low', 'medium', 'high', 'pulse']

export const MapLegend = () => (
  <div className="rounded-2xl border border-[var(--color-cream-dark)] bg-white/95 p-3 shadow-lg">
    <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-warm-gray)]">
      Legenda
    </h3>
    <div className="space-y-2">
      {statuses.map((status) => (
        <div key={status} className="flex items-center gap-2 text-xs font-semibold">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: cityStatusColor(status) }}
            aria-hidden
          />
          {pulseLabel(status)}
        </div>
      ))}
    </div>
  </div>
)
