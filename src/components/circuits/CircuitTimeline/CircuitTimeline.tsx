import type { CircuitStop } from '../../../types/circuit.types'
import { formatDate } from '../../../utils/formatters'

export const CircuitTimeline = ({ stops }: { stops: CircuitStop[] }) => (
  <div className="space-y-0">
    {stops.map((stop, index) => (
      <div key={stop.id} className="grid grid-cols-[32px_1fr] gap-3">
        <div className="flex flex-col items-center">
          <span
            className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold text-white ${
              index === 1 ? 'bg-[var(--color-secondary-300)]' : 'bg-[var(--color-primary-300)]'
            }`}
          >
            {index + 1}
          </span>
          {index < stops.length - 1 ? <span className="h-16 w-px bg-[var(--color-cream-dark)]" /> : null}
        </div>
        <article className="pb-5">
          <div className="rounded-2xl border border-[var(--color-cream-dark)] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-warm-gray)]">
              {formatDate(stop.date)} · {stop.time || 'horário a confirmar'}
            </p>
            <h3 className="font-display text-lg">{stop.municipality}</h3>
            <p className="text-sm text-[var(--color-warm-gray)]">{stop.venue}</p>
            {stop.distanceFromPreviousKm ? (
              <p className="mt-2 text-xs text-[var(--color-blue-500)]">
                {stop.distanceFromPreviousKm} km desde a parada anterior · {stop.travelTime}
              </p>
            ) : null}
          </div>
        </article>
      </div>
    ))}
  </div>
)
