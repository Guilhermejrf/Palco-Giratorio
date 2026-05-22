import { CalendarDays, CheckCircle2, GraduationCap, Hammer, MapPin, Route } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button/Button'
import type { Municipality } from '../../../types/map.types'

interface MunicipalityPanelProps {
  municipality: Municipality | null
  onClose: () => void
}

export const MunicipalityPanel = ({ municipality, onClose }: MunicipalityPanelProps) => {
  const navigate = useNavigate()

  if (!municipality) return null

  const startCircuit = () => {
    toast.success(`${municipality.name} selecionado como parada inicial.`)
    navigate('/circuitos/novo', { state: { municipalityId: municipality.id } })
  }

  const rows = [
    { icon: Route, label: 'Circuitos ativos', value: municipality.activeCircuits.length || 'Nenhum agora' },
    { icon: MapPin, label: 'Espaços disponíveis', value: municipality.venues.join(', ') },
    { icon: Hammer, label: 'Recursos locais', value: municipality.resources.join(', ') },
    { icon: GraduationCap, label: 'Escolas cadastradas', value: municipality.schools },
  ]

  return (
    <aside className="fixed bottom-0 right-0 z-[600] max-h-[85vh] w-full overflow-auto rounded-t-3xl border-l border-[var(--color-cream-dark)] bg-white p-5 shadow-2xl md:bottom-auto md:top-16 md:h-[calc(100vh-64px)] md:max-h-none md:w-[380px] md:rounded-none">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-warm-gray)]">
            {municipality.region}
          </p>
          <h2 className="font-display text-2xl">{municipality.name}</h2>
        </div>
        <button
          aria-label="Fechar painel do município"
          className="rounded-full px-3 py-1 text-sm font-bold hover:bg-[var(--color-cream)]"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
      <div className="mb-5 rounded-2xl bg-[var(--color-cream)] p-4">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-sm font-semibold">Índice de pulso</span>
          <strong className="font-mono text-3xl">{municipality.pulseIndex}</strong>
        </div>
        <div className="h-3 rounded-full bg-white">
          <div
            className="h-3 rounded-full bg-[var(--color-secondary-300)]"
            style={{ width: `${municipality.pulseIndex}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-[var(--color-warm-gray)]">
          Último evento há {municipality.daysSinceLastEvent} dias.
        </p>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <section key={row.label} className="rounded-2xl border border-[var(--color-cream-dark)] p-3">
            <div className="mb-1 flex items-center gap-2 text-sm font-bold">
              <row.icon className="h-4 w-4 text-[var(--color-secondary-300)]" />
              {row.label}
            </div>
            <p className="text-sm text-[var(--color-warm-gray)]">{row.value}</p>
          </section>
        ))}
      </div>
      <section className="mt-4 rounded-2xl border border-[var(--color-cream-dark)] p-3">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
          <CalendarDays className="h-4 w-4 text-[var(--color-secondary-300)]" />
          Histórico
        </h3>
        <div className="space-y-3">
          {municipality.lastEvents.map((event) => (
            <div key={`${event.date}-${event.title}`} className="flex gap-2 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
              <div>
                <strong>{event.title}</strong>
                <p className="text-xs text-[var(--color-warm-gray)]">
                  {event.date} · {event.language}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Button className="mt-5 w-full" onClick={startCircuit}>
        Montar circuito aqui
      </Button>
    </aside>
  )
}
