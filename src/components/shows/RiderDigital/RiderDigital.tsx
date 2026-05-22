import { CheckCircle2, Lightbulb, Plug, Ruler, Users, Volume2, XCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import type { Show } from '../../../types/show.types'
import { formatCurrency } from '../../../utils/formatters'
import { Button } from '../../ui/Button/Button'
import { Modal } from '../../ui/Modal/Modal'

interface RiderDigitalProps {
  show: Show | null
  open: boolean
  onClose: () => void
}

export const RiderDigital = ({ show, open, onClose }: RiderDigitalProps) => {
  const [checked, setChecked] = useState(false)

  if (!show) return null

  const specs = [
    { icon: Ruler, label: 'Palco', value: `${show.rider.stageWidth}m x ${show.rider.stageDepth}m` },
    { icon: Volume2, label: 'Som', value: show.rider.sound },
    { icon: Lightbulb, label: 'Luz', value: show.rider.light },
    { icon: Plug, label: 'Energia', value: `${show.rider.powerKw} kW` },
    { icon: Users, label: 'Equipe técnica', value: `${show.rider.technicians} técnicos` },
  ]

  const runCompatibility = () => {
    setChecked(true)
    toast.success('Compatibilidade calculada: 84% com recursos locais.')
  }

  return (
    <Modal open={open} onClose={onClose} title={`Rider digital · ${show.name}`}>
      <p className="mb-5 text-sm text-[var(--color-warm-gray)]">
        {show.group} · {show.originCity} · {formatCurrency(show.minFee)}
      </p>
      <div className="grid gap-3 md:grid-cols-2">
        {specs.map((spec) => (
          <article key={spec.label} className="rounded-2xl border border-[var(--color-cream-dark)] p-4">
            <div className="mb-2 flex items-center gap-2 font-bold">
              <spec.icon className="h-4 w-4 text-[var(--color-secondary-300)]" />
              {spec.label}
            </div>
            <p className="text-sm text-[var(--color-warm-gray)]">{spec.value}</p>
          </article>
        ))}
      </div>
      <section className="mt-5 rounded-2xl bg-[var(--color-cream)] p-4">
        <h3 className="mb-2 font-bold">Logística</h3>
        <p className="text-sm text-[var(--color-warm-gray)]">
          Carga de {show.rider.cargoKg}kg, volume de {show.rider.cargoM3}m³ e montagem em{' '}
          {show.rider.setupHours} horas.
        </p>
      </section>
      {checked ? (
        <section className="mt-5 rounded-2xl border border-[var(--color-cream-dark)] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-bold">Compatibilidade com Sesc Arcoverde</h3>
            <strong className="rounded-full bg-[#C8DBC8] px-3 py-1 text-sm text-[var(--color-primary-700)]">
              84%
            </strong>
          </div>
          <div className="space-y-2 text-sm">
            {['Palco', 'Som', 'Energia'].map((item) => (
              <p key={item} className="flex items-center gap-2 text-[var(--color-success)]">
                <CheckCircle2 className="h-4 w-4" /> {item} coberto localmente
              </p>
            ))}
            <p className="flex items-center gap-2 text-[var(--color-warning)]">
              <XCircle className="h-4 w-4" /> Operador de luz extra precisa ser contratado
            </p>
          </div>
        </section>
      ) : null}
      <Button className="mt-5 w-full" onClick={runCompatibility}>
        Verificar compatibilidade com espaço
      </Button>
    </Modal>
  )
}
