import { Home, Plus, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { MapLegend } from '../../components/map/MapLegend/MapLegend'
import { MapVivo } from '../../components/map/MapVivo/MapVivo'
import { MunicipalityPanel } from '../../components/map/MunicipalityPanel/MunicipalityPanel'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { Select } from '../../components/ui/Select/Select'
import { LANGUAGES } from '../../constants/languages'
import { REGIONS } from '../../constants/regions'
import { useMapStore } from '../../stores/mapStore'

export const MapaVivoPage = () => {
  const [routeModal, setRouteModal] = useState(false)
  const [routeStep, setRouteStep] = useState(1)
  const selected = useMapStore((state) => state.selectedMunicipality)
  const selectMunicipality = useMapStore((state) => state.selectMunicipality)
  const filters = useMapStore((state) => state.activeFilters)
  const setFilter = useMapStore((state) => state.setFilter)
  const toggleCircuitRoutes = useMapStore((state) => state.toggleCircuitRoutes)
  const toggleResourcesLayer = useMapStore((state) => state.toggleResourcesLayer)

  const createProposal = () => {
    toast.success('Proposta de circuito criada e enviada para curadoria.')
    setRouteModal(false)
    setRouteStep(1)
  }

  return (
    <div className="relative h-[calc(100vh-64px)]">
      <MapVivo />
      <div className="absolute left-3 right-3 top-3 z-[500] rounded-2xl border border-[var(--color-cream-dark)] bg-white/95 p-3 shadow-lg md:left-6 md:right-auto">
        <div className="grid gap-2 md:grid-cols-5">
          <Select
            aria-label="Filtrar linguagem"
            options={[{ label: 'Linguagem', value: '' }, ...LANGUAGES.map((language) => ({ label: language, value: language }))]}
            value={filters.language}
            onChange={(event) => setFilter('language', event.target.value)}
          />
          <Select
            aria-label="Filtrar região"
            options={[{ label: 'Região', value: '' }, ...REGIONS.map((region) => ({ label: region, value: region }))]}
            value={filters.region}
            onChange={(event) => setFilter('region', event.target.value)}
          />
          <Select
            aria-label="Filtrar período"
            options={[
              { label: '30 dias', value: '30d' },
              { label: '90 dias', value: '90d' },
              { label: 'Ano', value: 'year' },
            ]}
            value={filters.period}
            onChange={(event) => setFilter('period', event.target.value)}
          />
          <Select
            aria-label="Filtrar status"
            options={[
              { label: 'Status', value: '' },
              { label: 'Sem circulação', value: 'off' },
              { label: 'Baixa', value: 'low' },
              { label: 'Ativa', value: 'medium' },
              { label: 'Circuito', value: 'high' },
              { label: 'Agora', value: 'pulse' },
            ]}
            value={filters.status}
            onChange={(event) => setFilter('status', event.target.value)}
          />
          <Button
            icon={<RotateCcw className="h-4 w-4" />}
            onClick={() => {
              setFilter('language', '')
              setFilter('region', '')
              setFilter('status', '')
            }}
            variant="ghost"
          >
            Limpar
          </Button>
        </div>
      </div>
      <div className="absolute bottom-24 left-4 z-[500] md:bottom-6">
        <MapLegend />
      </div>
      <div className="absolute bottom-24 right-4 z-[500] flex flex-col gap-2 md:bottom-6">
        <Link to="/">
          <Button className="w-full" icon={<Home className="h-4 w-4" />} variant="secondary">
            Voltar ao início
          </Button>
        </Link>
        <Button onClick={toggleCircuitRoutes} variant="secondary">
          Mostrar circuitos
        </Button>
        <Button onClick={toggleResourcesLayer} variant="secondary">
          Mostrar recursos
        </Button>
        <Button icon={<Plus className="h-4 w-4" />} onClick={() => setRouteModal(true)}>
          Propor nova rota
        </Button>
      </div>
      <MunicipalityPanel municipality={selected} onClose={() => selectMunicipality(null)} />
      <Modal open={routeModal} title="Propor nova rota" onClose={() => setRouteModal(false)}>
        <div className="grid gap-4 md:grid-cols-4">
          {['Selecionar espetáculo', 'Municípios', 'Período', 'Estimativa'].map((step, index) => (
            <button
              key={step}
              className={`rounded-2xl p-4 text-left ${
                routeStep === index + 1 ? 'bg-[var(--color-primary-700)] text-white' : 'bg-[var(--color-cream)]'
              }`}
              onClick={() => setRouteStep(index + 1)}
              type="button"
            >
              <span className="font-mono text-xs text-[var(--color-secondary-300)]">Step {index + 1}</span>
              <h3 className="font-bold">{step}</h3>
            </button>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-[var(--color-cream-dark)] p-4">
          <h3 className="font-bold">
            {routeStep === 1
              ? 'A Peleja do Riso'
              : routeStep === 2
                ? 'Caruaru, Arcoverde, Recife e Olinda'
                : routeStep === 3
                  ? '24 a 30 de junho'
                  : 'Economia estimada de 34%'}
          </h3>
          <p className="text-sm text-[var(--color-warm-gray)]">
            {routeStep === 4
              ? 'Custo dividido entre 4 contratantes, com técnico local em Arcoverde e escola incluída em Caruaru.'
              : 'Clique nos passos para revisar a proposta antes de criar o circuito.'}
          </p>
        </div>
        <p className="mt-5 text-sm text-[var(--color-warm-gray)]">
          A proposta cruza rider, cidades selecionadas, contratantes e recursos locais para estimar custo e economia.
        </p>
        <Button className="mt-5" onClick={createProposal}>
          Criar proposta de circuito
        </Button>
      </Modal>
    </div>
  )
}
