import { useState } from 'react'
import toast from 'react-hot-toast'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from 'react-leaflet'
import { useParams } from 'react-router-dom'
import { CircuitTimeline } from '../../../components/circuits/CircuitTimeline/CircuitTimeline'
import { CostSplitBar } from '../../../components/circuits/CostSplitBar/CostSplitBar'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { SchoolNearCircuit } from '../../../components/schools/SchoolNearCircuit/SchoolNearCircuit'
import { Button } from '../../../components/ui/Button/Button'
import { Card } from '../../../components/ui/Card/Card'
import { Modal } from '../../../components/ui/Modal/Modal'
import { municipalities } from '../../../constants/municipalities'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { formatCurrency } from '../../../utils/formatters'

export const CircuitoDetail = () => {
  const { id } = useParams()
  const [splitOpen, setSplitOpen] = useState(false)
  const [sescShare, setSescShare] = useState(55)
  const circuits = useDemoDataStore((state) => state.circuits)
  const schools = useDemoDataStore((state) => state.schools)
  const includedSchoolIds = useDemoDataStore((state) => state.includedSchoolIds)
  const updateCircuitCostSplit = useDemoDataStore((state) => state.updateCircuitCostSplit)
  const circuit = circuits.find((item) => item.id === id) ?? circuits[0]
  const includedSchools = schools
    .filter((school) => includedSchoolIds.includes(school.id))
    .map((school, index) => {
      const cityCoords =
        municipalities.find((municipality) => municipality.name === school.city)?.coords ??
        circuit.stops.find((stop) => stop.municipality === school.city)?.coords ??
        circuit.stops[0].coords

      return {
        ...school,
        coords: {
          lat: cityCoords.lat + 0.035 + index * 0.01,
          lng: cityCoords.lng + 0.035 + index * 0.01,
        },
      }
    })

  const saveSimulation = () => {
    updateCircuitCostSplit(circuit.id, sescShare)
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
                {includedSchools.map((school) => (
                  <CircleMarker
                    key={school.id}
                    center={[school.coords.lat, school.coords.lng]}
                    radius={10}
                    pathOptions={{ color: '#2E5F7E', fillColor: '#F0B35A', fillOpacity: 0.9, weight: 3 }}
                  >
                    <Tooltip direction="top">Escola incluída · {school.name}</Tooltip>
                    <Popup>
                      <strong>{school.name}</strong>
                      <br />
                      Ponto formativo em {school.city}
                      <br />
                      {school.students} alunos
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
            {includedSchools.length ? (
              <div className="mt-3 rounded-2xl bg-[var(--color-cream)] p-3 text-sm text-[var(--color-warm-gray)]">
                <strong className="text-[var(--color-charcoal)]">Pontos formativos no mapa:</strong>{' '}
                {includedSchools.map((school) => school.name).join(', ')}
              </div>
            ) : null}
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
