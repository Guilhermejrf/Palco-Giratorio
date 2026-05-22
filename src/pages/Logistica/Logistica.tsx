import { AlertTriangle, CheckCircle2, Truck } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { MapVivo } from '../../components/map/MapVivo/MapVivo'
import { Button } from '../../components/ui/Button/Button'
import { Card } from '../../components/ui/Card/Card'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { useDemoDataStore } from '../../stores/demoDataStore'
import { formatCurrency } from '../../utils/formatters'

const overlaps = [
  {
    id: 'ov1',
    title: 'Grupo A e Grupo B saem do Recife para o Agreste na mesma semana',
    groupA: { name: 'Mamulengo Flor do Sertão', cargoKg: 180, cargoM3: 2.4 },
    groupB: { name: 'Cia Trapiá de Dança', cargoKg: 90, cargoM3: 1.2 },
    region: 'Agreste',
    period: '20 a 25 de junho',
  },
  {
    id: 'ov2',
    title: 'Mamulengo Flor do Sertão pode dividir van com oficina em Arcoverde',
    groupA: { name: 'Mamulengo Flor do Sertão', cargoKg: 180, cargoM3: 2.4 },
    groupB: { name: 'Oficina de Bonecos PE', cargoKg: 60, cargoM3: 0.8 },
    region: 'Sertão',
    period: '22 de junho',
  },
  {
    id: 'ov3',
    title: 'Retorno de Petrolina coincide com carga de luz para Salgueiro',
    groupA: { name: 'Núcleo São Francisco', cargoKg: 340, cargoM3: 4.0 },
    groupB: { name: 'Sesc Logística', cargoKg: 120, cargoM3: 1.8 },
    region: 'Sertão do São Francisco',
    period: 'Primeira semana de julho',
  },
]

const nextFourWeeks = [
  { week: '22 a 28 mai', circuits: ['Circuito Bonecos Acesos (Caruaru → Arcoverde)'], status: 'active' },
  { week: '29 mai a 4 jun', circuits: ['Corpos do Agreste (Caruaru → Garanhuns)'], status: 'planning' },
  { week: '5 a 11 jun', circuits: [], status: 'gap' },
  { week: '12 a 18 jun', circuits: ['Lonas Abertas (Goiana → Palmares)', 'Corpos de Barro (Caruaru)'], status: 'active' },
]

const emergencyResources = [
  { type: 'Técnico substituto', name: 'João Silva — Som e Luz', city: 'Caruaru', available: true },
  { type: 'Transportadora parceira', name: 'Borborema Frete', city: 'Caruaru', available: true },
  { type: 'Espaço alternativo', name: 'Centro Cultural Alfredo Leite', city: 'Garanhuns', available: true },
  { type: 'Hospedagem emergencial', name: 'Pousada Rede Sesc', city: 'Arcoverde', available: false },
]

export const Logistica = () => {
  const [selectedOverlap, setSelectedOverlap] = useState<(typeof overlaps)[0] | null>(null)
  const [emergencyOpen, setEmergencyOpen] = useState(false)
  const [logisticsForm, setLogisticsForm] = useState({
    vehicle: 'Van de carga 8m³',
    date: '',
    owner: 'Central Logística Sesc PE',
  })
  const logisticsConsolidations = useDemoDataStore((state) => state.logisticsConsolidations)
  const addLogisticsConsolidation = useDemoDataStore((state) => state.addLogisticsConsolidation)

  const consolidate = () => {
    if (selectedOverlap) {
      addLogisticsConsolidation({
        title: selectedOverlap.title,
        vehicle: logisticsForm.vehicle,
        date: logisticsForm.date || 'Data a confirmar',
        owner: logisticsForm.owner,
      })
    }
    toast.success('Consolidação criada e fornecedores convidados.')
    setSelectedOverlap(null)
  }

  const totalCargo = selectedOverlap
    ? selectedOverlap.groupA.cargoKg + selectedOverlap.groupB.cargoKg
    : 0
  const totalVolume = selectedOverlap
    ? selectedOverlap.groupA.cargoM3 + selectedOverlap.groupB.cargoM3
    : 0
  const shareA = selectedOverlap ? Math.round((selectedOverlap.groupA.cargoKg / totalCargo) * 100) : 0
  const shareB = selectedOverlap ? 100 - shareA : 0
  const estimatedFreight = Math.round(totalVolume * 480)

  return (
    <div>
      <PageHeader
        title="Central Logística"
        subtitle="Consolidação de cargas, rotas sobrepostas, gestão de imprevistos e transporte compartilhado."
        decorativeShape="semicircle"
        decorativeColor="var(--color-secondary-100)"
        actions={
          <Button variant="secondary" onClick={() => setEmergencyOpen(true)}>
            Acionar suporte emergencial
          </Button>
        }
      />
      <div className="space-y-6 p-4 md:p-8">
        {/* Painel das próximas 4 semanas */}
        <Card interactive={false}>
          <h2 className="mb-4 font-display text-2xl">Circulações — próximas 4 semanas</h2>
          <div className="grid gap-3 md:grid-cols-4">
            {nextFourWeeks.map((week) => (
              <div
                key={week.week}
                className={`rounded-2xl p-3 ${
                  week.status === 'active'
                    ? 'bg-[var(--color-primary-100)]'
                    : week.status === 'gap'
                      ? 'border border-dashed border-[var(--color-warning)] bg-[var(--color-accent-100)]'
                      : 'bg-[var(--color-cream)]'
                }`}
              >
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--color-warm-gray)]">
                  {week.week}
                </p>
                {week.circuits.length > 0 ? (
                  week.circuits.map((c) => (
                    <p key={c} className="text-xs font-semibold">
                      {c}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-[var(--color-warning)] font-semibold">
                    Nenhuma circulação prevista — município em risco de queda no IAC
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <h2 className="font-display text-2xl">Sobreposições detectadas</h2>
            {overlaps.map((item) => (
              <Card key={item.id}>
                <div className="flex gap-3">
                  <Truck className="mt-1 h-5 w-5 shrink-0 text-[var(--color-secondary-300)]" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold leading-snug">{item.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
                      {item.region} · {item.period}
                    </p>
                    <p className="text-sm text-[var(--color-warm-gray)]">
                      Carga combinada: {item.groupA.cargoKg + item.groupB.cargoKg}kg ·{' '}
                      {(item.groupA.cargoM3 + item.groupB.cargoM3).toFixed(1)}m³ · Economia estimada entre 18% e 34%.
                    </p>
                    <Button className="mt-3" onClick={() => setSelectedOverlap(item)} variant="secondary">
                      Consolidar cargas
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
            {logisticsConsolidations.map((item) => (
              <Card key={item.id} className="border-l-4 border-l-[var(--color-primary-300)]">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[var(--color-primary-700)]" />
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-[var(--color-warm-gray)]">
                      Consolidado: {item.vehicle} · {item.date} · {item.owner}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </section>
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Mapa de movimentação</h2>
            <div className="h-[520px] overflow-hidden rounded-2xl">
              <MapVivo />
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de Consolidação com cálculo proporcional */}
      <Modal
        open={Boolean(selectedOverlap)}
        title="Consolidar cargas"
        onClose={() => setSelectedOverlap(null)}
      >
        {selectedOverlap && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[var(--color-cream)] p-4">
              <strong>{selectedOverlap.title}</strong>
              <p className="mt-1 text-sm text-[var(--color-warm-gray)]">
                O sistema sugere veículo único, coleta compartilhada e divisão proporcional por volume.
              </p>
            </div>

            {/* Divisão proporcional por peso */}
            <div className="rounded-2xl border border-[var(--color-cream-dark)] p-4 text-sm">
              <p className="mb-3 font-bold">Divisão proporcional por peso de carga</p>
              <div className="mb-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-[var(--color-secondary-50)] p-3">
                  <p className="text-xs text-[var(--color-warm-gray)]">{selectedOverlap.groupA.name}</p>
                  <strong>{selectedOverlap.groupA.cargoKg}kg · {selectedOverlap.groupA.cargoM3}m³</strong>
                  <p className="mt-1 text-[var(--color-secondary-500)] font-bold">{shareA}% do frete</p>
                  <p className="text-xs">{formatCurrency(Math.round(estimatedFreight * shareA / 100))}</p>
                </div>
                <div className="rounded-xl bg-[var(--color-primary-100)] p-3">
                  <p className="text-xs text-[var(--color-warm-gray)]">{selectedOverlap.groupB.name}</p>
                  <strong>{selectedOverlap.groupB.cargoKg}kg · {selectedOverlap.groupB.cargoM3}m³</strong>
                  <p className="mt-1 text-[var(--color-primary-700)] font-bold">{shareB}% do frete</p>
                  <p className="text-xs">{formatCurrency(Math.round(estimatedFreight * shareB / 100))}</p>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[var(--color-cream-dark)]">
                <div
                  className="h-2 rounded-full bg-[var(--color-secondary-300)]"
                  style={{ width: `${shareA}%` }}
                />
              </div>
              <p className="mt-2 text-center text-xs text-[var(--color-warm-gray)]">
                Frete total estimado: <strong>{formatCurrency(estimatedFreight)}</strong>
              </p>
            </div>

            <Input
              label="Veículo sugerido"
              onChange={(event) => setLogisticsForm((current) => ({ ...current, vehicle: event.target.value }))}
              value={logisticsForm.vehicle}
            />
            <Input
              label="Data de saída"
              onChange={(event) => setLogisticsForm((current) => ({ ...current, date: event.target.value }))}
              type="date"
              value={logisticsForm.date}
            />
            <Input
              label="Responsável pela consolidação"
              onChange={(event) => setLogisticsForm((current) => ({ ...current, owner: event.target.value }))}
              value={logisticsForm.owner}
            />
            <Button onClick={consolidate}>Confirmar consolidação e notificar grupos</Button>
          </div>
        )}
      </Modal>

      {/* Modal de suporte emergencial */}
      <Modal open={emergencyOpen} title="Suporte emergencial" onClose={() => setEmergencyOpen(false)}>
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-2xl border border-[var(--color-warning)] bg-[var(--color-accent-100)] p-4 text-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-warning)]" />
            <p>
              Ative o suporte se algo falhou durante uma circulação. O sistema localiza recursos alternativos próximos.
            </p>
          </div>
          <div className="space-y-3">
            {emergencyResources.map((resource) => (
              <div
                key={`${resource.type}-${resource.name}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-cream-dark)] p-3 text-sm"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-warm-gray)]">
                    {resource.type}
                  </p>
                  <p className="font-semibold">{resource.name}</p>
                  <p className="text-xs text-[var(--color-warm-gray)]">{resource.city}</p>
                </div>
                <Button
                  disabled={!resource.available}
                  variant="secondary"
                  onClick={() => toast.success(`${resource.name} acionado com sucesso.`)}
                >
                  {resource.available ? 'Acionar' : 'Indisponível'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  )
}
