import { useState } from 'react'
import toast from 'react-hot-toast'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import { CircuitTimeline } from '../../../components/circuits/CircuitTimeline/CircuitTimeline'
import { CostSplitBar } from '../../../components/circuits/CostSplitBar/CostSplitBar'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { SchoolNearCircuit } from '../../../components/schools/SchoolNearCircuit/SchoolNearCircuit'
import { Button } from '../../../components/ui/Button/Button'
import { Card } from '../../../components/ui/Card/Card'
import { Modal } from '../../../components/ui/Modal/Modal'
import { circuits } from '../../../constants/mockData'
import { formatCurrency } from '../../../utils/formatters'

export const CircuitoDetail = () => {
  const { id } = useParams()
  const [splitOpen, setSplitOpen] = useState(false)
  const [sescShare, setSescShare] = useState(55)
  const circuit = circuits.find((item) => item.id === id) ?? circuits[0]

  const saveSimulation = () => {
    toast.success('Nova divisão simulada salva como proposta.')
    setSplitOpen(false)
  }

  return (
    <div>
      <PageHeader title={circuit.name} subtitle={`${circuit.showName} · ${circuit.region}`} />
      <div className="grid gap-6 p-4 md:p-8 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6">
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Timeline da rota</h2>
            <CircuitTimeline stops={circuit.stops} />
          </Card>
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Mapa da rota</h2>
            <div className="h-[320px] overflow-hidden rounded-2xl">
              <MapContainer center={[circuit.stops[0].coords.lat, circuit.stops[0].coords.lng]} zoom={7}>
                <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                <Polyline
                  positions={circuit.stops.map((stop) => [stop.coords.lat, stop.coords.lng])}
                  pathOptions={{ color: '#C4755A', weight: 4 }}
                />
                {circuit.stops.map((stop, index) => (
                  <Marker key={stop.id} position={[stop.coords.lat, stop.coords.lng]}>
                    <Tooltip>
                      {index + 1}. {stop.municipality} · {stop.date}
                    </Tooltip>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
        </section>
        <aside className="space-y-6">
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Divisão de custos</h2>
            <CostSplitBar shares={circuit.costShares} />
            <p className="mt-4 text-sm text-[var(--color-warm-gray)]">
              Total estimado: <strong>{formatCurrency(circuit.totalCost)}</strong>
            </p>
            <Button className="mt-4 w-full" onClick={() => setSplitOpen(true)} variant="secondary">
              Simular nova divisão
            </Button>
          </Card>
          <Card interactive={false}>
            <h2 className="mb-4 font-display text-2xl">Escolas próximas</h2>
            <SchoolNearCircuit />
          </Card>
        </aside>
      </div>
      <Modal open={splitOpen} title="Simular nova divisão" onClose={() => setSplitOpen(false)}>
        <div className="space-y-5">
          <label className="block text-sm font-semibold">
            Participação Sesc Pernambuco: {sescShare}%
            <input
              className="mt-3 w-full accent-[var(--color-secondary-300)]"
              max="80"
              min="20"
              onChange={(event) => setSescShare(Number(event.target.value))}
              type="range"
              value={sescShare}
            />
          </label>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-[var(--color-cream)] p-4">
              <p className="text-xs text-[var(--color-warm-gray)]">Sesc Pernambuco</p>
              <strong>{formatCurrency((circuit.totalCost * sescShare) / 100)}</strong>
            </div>
            <div className="rounded-2xl bg-[var(--color-cream)] p-4">
              <p className="text-xs text-[var(--color-warm-gray)]">Parceiros</p>
              <strong>{formatCurrency((circuit.totalCost * (100 - sescShare)) / 100)}</strong>
            </div>
          </div>
          <Button onClick={saveSimulation}>Salvar simulação</Button>
        </div>
      </Modal>
    </div>
  )
}
