import { CheckCircle2, Lightbulb, Plug, Ruler, Users, Volume2, XCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { municipalities } from '../../../constants/municipalities'
import type { Show } from '../../../types/show.types'
import { formatCurrency } from '../../../utils/formatters'
import { Button } from '../../ui/Button/Button'
import { Modal } from '../../ui/Modal/Modal'
import { Select } from '../../ui/Select/Select'

interface RiderDigitalProps {
  show: Show | null
  open: boolean
  onClose: () => void
}

// Especificações técnicas dos espaços principais (demo)
const venueSpecs: Record<string, { sound: boolean; light: boolean; stage: boolean; power: boolean; technician: boolean; cargoLimit: number }> = {
  'Recife':        { sound: true,  light: true,  stage: true,  power: true,  technician: true,  cargoLimit: 500 },
  'Caruaru':       { sound: true,  light: true,  stage: true,  power: true,  technician: true,  cargoLimit: 400 },
  'Olinda':        { sound: true,  light: false, stage: true,  power: true,  technician: false, cargoLimit: 300 },
  'Arcoverde':     { sound: false, light: true,  stage: false, power: true,  technician: true,  cargoLimit: 250 },
  'Garanhuns':     { sound: true,  light: true,  stage: false, power: true,  technician: false, cargoLimit: 300 },
  'Petrolina':     { sound: true,  light: false, stage: true,  power: false, technician: true,  cargoLimit: 350 },
  'Serra Talhada': { sound: false, light: false, stage: false, power: true,  technician: false, cargoLimit: 200 },
  'Salgueiro':     { sound: false, light: false, stage: false, power: false, technician: false, cargoLimit: 150 },
  'Goiana':        { sound: false, light: false, stage: false, power: true,  technician: false, cargoLimit: 200 },
  'Palmares':      { sound: false, light: false, stage: false, power: true,  technician: false, cargoLimit: 180 },
  'Floresta':      { sound: false, light: false, stage: false, power: false, technician: false, cargoLimit: 100 },
  'Ouricuri':      { sound: false, light: false, stage: false, power: false, technician: false, cargoLimit: 100 },
}

const computeCompatibility = (show: Show, city: string) => {
  const specs = venueSpecs[city] ?? { sound: false, light: false, stage: false, power: false, technician: false, cargoLimit: 200 }

  const items = [
    { label: 'Sistema de som', ok: specs.sound, saving: specs.sound ? Math.round(show.rider.cargoKg * 0.18) : 0 },
    { label: 'Iluminação cênica', ok: specs.light, saving: specs.light ? Math.round(show.rider.cargoKg * 0.14) : 0 },
    { label: 'Estrutura de palco', ok: specs.stage, saving: specs.stage ? Math.round(show.rider.cargoKg * 0.22) : 0 },
    { label: 'Fornecimento de energia', ok: specs.power, saving: specs.power ? Math.round(show.rider.cargoKg * 0.06) : 0 },
    { label: 'Técnico local disponível', ok: specs.technician, saving: specs.technician ? 450 : 0 },
  ]

  const compatible = items.filter((i) => i.ok).length
  const score = Math.round((compatible / items.length) * 100)
  const cargoReduction = items.filter((i) => i.ok).reduce((sum, i) => sum + i.saving, 0)
  const freightSaving = Math.round((cargoReduction / Math.max(show.rider.cargoKg, 1)) * 100)

  return { items, score, cargoReduction, freightSaving }
}

export const RiderDigital = ({ show, open, onClose }: RiderDigitalProps) => {
  const [selectedCity, setSelectedCity] = useState('')
  const [checked, setChecked] = useState(false)

  if (!show) return null

  const specs = [
    { icon: Ruler, label: 'Palco', value: `${show.rider.stageWidth}m × ${show.rider.stageDepth}m` },
    { icon: Volume2, label: 'Som', value: show.rider.sound },
    { icon: Lightbulb, label: 'Luz', value: show.rider.light },
    { icon: Plug, label: 'Energia', value: `${show.rider.powerKw} kW` },
    { icon: Users, label: 'Equipe técnica', value: `${show.rider.technicians} técnico${show.rider.technicians !== 1 ? 's' : ''}` },
  ]

  const cityOptions = municipalities.map((m) => ({ label: m.name, value: m.name }))
  const compat = selectedCity ? computeCompatibility(show, selectedCity) : null

  const runCompatibility = () => {
    if (!selectedCity) {
      toast.error('Selecione um município para verificar a compatibilidade.')
      return
    }
    setChecked(true)
    if (compat) {
      toast.success(`Compatibilidade calculada: ${compat.score}% com ${selectedCity}.`)
    }
  }

  const scoreColor =
    (compat?.score ?? 0) >= 80
      ? 'bg-[var(--color-accent-200)] text-[var(--color-primary-700)]'
      : (compat?.score ?? 0) >= 50
        ? 'bg-[var(--color-accent-100)] text-[var(--color-secondary-500)]'
        : 'bg-[var(--color-secondary-100)] text-[var(--color-secondary-600)]'

  return (
    <Modal open={open} onClose={() => { setChecked(false); setSelectedCity(''); onClose() }} title={`Rider digital · ${show.name}`}>
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
        <h3 className="mb-2 font-bold">Logística de transporte</h3>
        <p className="text-sm text-[var(--color-warm-gray)]">
          Carga de <strong>{show.rider.cargoKg}kg</strong>, volume de <strong>{show.rider.cargoM3}m³</strong>,
          montagem em <strong>{show.rider.setupHours}h</strong>.
          {show.rider.generator ? ' Requer gerador próprio.' : ''}
        </p>
      </section>

      {/* Verificador de compatibilidade */}
      <section className="mt-5 space-y-3 rounded-2xl border border-[var(--color-cream-dark)] p-4">
        <h3 className="font-bold">Verificar compatibilidade com espaço</h3>
        <Select
          label="Selecione o município"
          options={[{ label: 'Escolha um município...', value: '' }, ...cityOptions]}
          value={selectedCity}
          onChange={(e) => { setSelectedCity(e.target.value); setChecked(false) }}
        />
        <Button className="w-full" onClick={runCompatibility}>
          Calcular compatibilidade
        </Button>
      </section>

      {checked && compat && selectedCity && (
        <section className="mt-4 rounded-2xl border border-[var(--color-cream-dark)] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="font-bold">Compatibilidade com {selectedCity}</h3>
            <strong className={`rounded-full px-3 py-1 text-sm ${scoreColor}`}>
              {compat.score}%
            </strong>
          </div>
          <div className="space-y-2 text-sm">
            {compat.items.map((item) =>
              item.ok ? (
                <p key={item.label} className="flex items-center gap-2 text-[var(--color-success)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" /> {item.label} — coberto localmente
                </p>
              ) : (
                <p key={item.label} className="flex items-center gap-2 text-[var(--color-warning)]">
                  <XCircle className="h-4 w-4 shrink-0" /> {item.label} — precisa transportar ou contratar
                </p>
              ),
            )}
          </div>
          {compat.cargoReduction > 0 && (
            <div className="mt-4 rounded-xl bg-[var(--color-secondary-50)] p-3 text-sm">
              <p className="flex items-center gap-2 font-bold text-[var(--color-secondary-500)]">
                <AlertCircle className="h-4 w-4" />
                Redução de carga possível
              </p>
              <p className="mt-1 text-[var(--color-warm-gray)]">
                Aprox. <strong>{compat.cargoReduction}kg removíveis</strong> da carga de transporte por
                existirem localmente. Economia estimada de <strong>{compat.freightSaving}%</strong> no
                custo de frete para esta parada.
              </p>
            </div>
          )}
        </section>
      )}
    </Modal>
  )
}
