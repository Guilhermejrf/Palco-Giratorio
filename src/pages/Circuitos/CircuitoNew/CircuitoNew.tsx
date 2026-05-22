import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { Button } from '../../../components/ui/Button/Button'
import { Card } from '../../../components/ui/Card/Card'
import { Input } from '../../../components/ui/Input/Input'
import { Select } from '../../../components/ui/Select/Select'
import { municipalities } from '../../../constants/municipalities'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { formatCurrency } from '../../../utils/formatters'

// Dados para calcular rotas
const lowPulse = [...municipalities].sort((a, b) => a.pulseIndex - b.pulseIndex)
const highPulse = [...municipalities].sort((a, b) => b.pulseIndex - a.pulseIndex)

interface RouteOption {
  label: string
  tag: string
  tagColor: string
  description: string
  cities: string[]
  cityIds: string[]
  totalCost: number
  costPerShow: number
  costPerSpectator: number
  citiesCount: number
  estimatedAudience: number
  savingsPercent: number
  localTechnicians: number
  contractors: string[]
}

const buildRoutes = (show: { minFee: number; rider: { cargoKg: number } }): RouteOption[] => {
  // Rota A — mais barata: cidades próximas com menor deslocamento
  const routeACities = municipalities.slice(0, 3)
  const routeACost = Math.round(show.minFee * 3 + 3 * 2800 + show.rider.cargoKg * 6)

  // Rota B — maior impacto territorial: municípios com menor IAC
  const routeBCities = lowPulse.slice(0, 4)
  const routeBCost = Math.round(show.minFee * 4 + 4 * 4200 + show.rider.cargoKg * 9)

  // Rota C — mais sustentável: prioriza recursos locais existentes
  const routeCCities = municipalities.filter((m) => m.resources.length > 1).slice(0, 4)
  const routeCCost = Math.round(show.minFee * 4 + 4 * 3100 + show.rider.cargoKg * 5)

  // Rota D — mais formativa: inclui cidades com escolas
  const routeDCities = municipalities.filter((m) => m.schools >= 15).slice(0, 4)
  const routeDCost = Math.round(show.minFee * 4 + 4 * 3600 + show.rider.cargoKg * 7)

  const individualCost = show.minFee * 4 + 4 * 6500 + show.rider.cargoKg * 14

  return [
    {
      label: 'Rota A',
      tag: 'Mais econômica',
      tagColor: 'bg-[var(--color-success)] text-white',
      description: 'Minimiza deslocamento e consolida cargas. Foco em regiões próximas com infraestrutura existente.',
      cities: routeACities.map((c) => c.name),
      cityIds: routeACities.map((c) => c.id),
      totalCost: routeACost,
      costPerShow: Math.round(routeACost / routeACities.length),
      costPerSpectator: Math.round(routeACost / (routeACities.length * 320)),
      citiesCount: routeACities.length,
      estimatedAudience: routeACities.length * 320,
      savingsPercent: Math.round(((individualCost - routeACost) / individualCost) * 100),
      localTechnicians: 2,
      contractors: routeACities.map((c) => `Sesc ${c.name}`),
    },
    {
      label: 'Rota B',
      tag: 'Maior impacto territorial',
      tagColor: 'bg-[var(--color-primary-700)] text-white',
      description:
        'Prioriza municípios com Índice de Acendimento Cultural mais baixo. Maximiza o alcance onde a cultura mais precisa chegar.',
      cities: routeBCities.map((c) => c.name),
      cityIds: routeBCities.map((c) => c.id),
      totalCost: routeBCost,
      costPerShow: Math.round(routeBCost / routeBCities.length),
      costPerSpectator: Math.round(routeBCost / (routeBCities.length * 220)),
      citiesCount: routeBCities.length,
      estimatedAudience: routeBCities.length * 220,
      savingsPercent: Math.round(((individualCost - routeBCost) / individualCost) * 100),
      localTechnicians: 3,
      contractors: routeBCities.map((c) => `Prefeitura de ${c.name}`),
    },
    {
      label: 'Rota C',
      tag: 'Mais sustentável',
      tagColor: 'bg-[var(--color-accent-300)] text-[var(--color-primary-700)]',
      description:
        'Maximiza o uso de recursos locais já existentes na rede. Reduz carga transportada e emissões de CO₂.',
      cities: routeCCities.map((c) => c.name),
      cityIds: routeCCities.map((c) => c.id),
      totalCost: routeCCost,
      costPerShow: Math.round(routeCCost / routeCCities.length),
      costPerSpectator: Math.round(routeCCost / (routeCCities.length * 280)),
      citiesCount: routeCCities.length,
      estimatedAudience: routeCCities.length * 280,
      savingsPercent: Math.round(((individualCost - routeCCost) / individualCost) * 100),
      localTechnicians: 5,
      contractors: routeCCities.map((c) => `Sesc ${c.name}`),
    },
    {
      label: 'Rota D',
      tag: 'Mais formativa',
      tagColor: 'bg-[var(--color-secondary-300)] text-white',
      description:
        'Inclui escolas e comunidades periféricas. Gera ações formativas, oficinas e rodas de conversa em cada parada.',
      cities: routeDCities.map((c) => c.name),
      cityIds: routeDCities.map((c) => c.id),
      totalCost: routeDCost,
      costPerShow: Math.round(routeDCost / routeDCities.length),
      costPerSpectator: Math.round(routeDCost / (routeDCities.length * 410)),
      citiesCount: routeDCities.length,
      estimatedAudience: routeDCities.length * 410,
      savingsPercent: Math.round(((individualCost - routeDCost) / individualCost) * 100),
      localTechnicians: 4,
      contractors: routeDCities.map((c, i) =>
        i % 2 === 0 ? `Sesc ${c.name}` : `Prefeitura de ${c.name}`,
      ),
    },
  ]
}

export const CircuitoNew = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as {
    showId?: string
    municipalityId?: string
    schoolId?: string
    opportunityId?: string
  } | null
  const shows = useDemoDataStore((store) => store.shows)
  const schools = useDemoDataStore((store) => store.schools)
  const opportunities = useDemoDataStore((store) => store.opportunities)
  const addCircuit = useDemoDataStore((store) => store.addCircuit)

  const opportunity = opportunities.find((item) => item.id === state?.opportunityId)
  const opportunityShow = shows.find((show) => show.name === opportunity?.showName)
  const schoolCity = schools.find((school) => school.id === state?.schoolId)?.city
  const schoolMunicipality = municipalities.find((city) => city.name === schoolCity)
  const initialShowId = state?.showId ?? opportunityShow?.id ?? shows[0].id

  const [step, setStep] = useState(1)
  const [selectedShow, setSelectedShow] = useState(initialShowId)
  const [simulationDone, setSimulationDone] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null)
  const [prodForm, setProdForm] = useState({
    originCity: schoolMunicipality?.name ?? 'Recife',
    artists: '4',
    publicType: 'Geral',
    budget: '',
  })

  const currentShow = shows.find((s) => s.id === selectedShow) ?? shows[0]
  const routes = buildRoutes(currentShow)

  const initialCities =
    state?.municipalityId
      ? [state.municipalityId]
      : schoolMunicipality
        ? [schoolMunicipality.id]
        : opportunity
          ? (opportunity.municipalities
              .map((name) => municipalities.find((city) => city.name === name)?.id)
              .filter(Boolean) as string[])
          : ['caruaru', 'arcoverde']

  const simulate = () => {
    setSimulationDone(true)
    setStep(3)
    toast.success('4 rotas simuladas com base no rider e nas cidades disponíveis.')
  }

  const chooseRoute = (route: RouteOption) => {
    setSelectedRoute(route)
    setStep(4)
  }

  const publish = () => {
    const route = selectedRoute ?? routes[0]
    const circuit = addCircuit({
      showId: selectedShow,
      cityIds: route.cityIds,
      contractorNames: route.contractors,
      opportunityId: state?.opportunityId,
      name: `Circuito ${currentShow.name} · ${route.label}`,
    })
    toast.success('Proposta publicada e convites enviados aos contratantes.')
    navigate(`/circuitos/${circuit.id}`)
  }

  const stepLabels = ['Espetáculo', 'Dados da produção', 'Simulação de rotas', 'Confirmar']

  return (
    <div>
      <PageHeader
        title="Simulador de circuitos"
        subtitle={
          state?.opportunityId
            ? 'Circuito iniciado a partir de uma oportunidade automática do sistema.'
            : 'Insira os dados da produção e simule as melhores rotas para o circuito.'
        }
      />
      <div className="p-4 md:p-8">
        <Card interactive={false}>
          {/* Steps nav */}
          <div className="mb-6 grid gap-2 md:grid-cols-4">
            {stepLabels.map((label, index) => (
              <button
                key={label}
                className={`rounded-full px-3 py-2 text-center text-sm font-bold transition ${
                  index + 1 === step
                    ? 'bg-[var(--color-primary-700)] text-white'
                    : index + 1 < step
                      ? 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]'
                      : 'bg-[var(--color-cream)]'
                }`}
                onClick={() => index + 1 <= step && setStep(index + 1)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Step 1 — Espetáculo */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-warm-gray)]">
                Selecione o espetáculo que será colocado em circulação.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {shows.map((show) => (
                  <button
                    key={show.id}
                    className={`rounded-2xl border p-4 text-left transition hover:border-[var(--color-secondary-300)] ${
                      selectedShow === show.id
                        ? 'border-[var(--color-secondary-300)] bg-[var(--color-secondary-50)]'
                        : 'border-[var(--color-cream-dark)]'
                    }`}
                    onClick={() => setSelectedShow(show.id)}
                    type="button"
                  >
                    <strong>{show.name}</strong>
                    <p className="mt-1 text-sm text-[var(--color-warm-gray)]">{show.group}</p>
                    <p className="mt-1 text-xs text-[var(--color-warm-gray)]">
                      {show.languages.join(', ')} · {formatCurrency(show.minFee)} cachê mínimo
                    </p>
                  </button>
                ))}
              </div>
              <Button onClick={() => setStep(2)}>Continuar</Button>
            </div>
          )}

          {/* Step 2 — Dados da produção */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-warm-gray)]">
                Informe os dados da produção para o simulador calcular as rotas ideais.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <Select
                  label="Cidade de origem"
                  options={municipalities.map((m) => ({ label: m.name, value: m.name }))}
                  value={prodForm.originCity}
                  onChange={(e) => setProdForm((f) => ({ ...f, originCity: e.target.value }))}
                />
                <Input
                  label="Número de artistas na equipe"
                  type="number"
                  value={prodForm.artists}
                  onChange={(e) => setProdForm((f) => ({ ...f, artists: e.target.value }))}
                />
                <Select
                  label="Tipo de público-alvo"
                  options={[
                    { label: 'Geral', value: 'Geral' },
                    { label: 'Infantil', value: 'Infantil' },
                    { label: 'Jovem', value: 'Jovem' },
                    { label: 'Familiar', value: 'Familiar' },
                    { label: 'Escolar', value: 'Escolar' },
                  ]}
                  value={prodForm.publicType}
                  onChange={(e) => setProdForm((f) => ({ ...f, publicType: e.target.value }))}
                />
                <Input
                  label="Orçamento disponível (opcional)"
                  type="number"
                  placeholder="R$ 0,00"
                  value={prodForm.budget}
                  onChange={(e) => setProdForm((f) => ({ ...f, budget: e.target.value }))}
                />
              </div>
              <div className="rounded-2xl bg-[var(--color-cream)] p-4 text-sm">
                <strong>Rider do espetáculo:</strong>
                <p className="mt-1 text-[var(--color-warm-gray)]">
                  {currentShow.rider.cargoKg}kg de carga · {currentShow.rider.cargoM3}m³ volume ·{' '}
                  {currentShow.rider.setupHours}h de montagem · {currentShow.rider.technicians}{' '}
                  {currentShow.rider.technicians === 1 ? 'técnico' : 'técnicos'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button onClick={simulate}>Simular 4 rotas</Button>
              </div>
            </div>
          )}

          {/* Step 3 — Simulação das 4 rotas */}
          {step === 3 && simulationDone && (
            <div className="space-y-4">
              <p className="text-sm text-[var(--color-warm-gray)]">
                O sistema gerou 4 cenários de rota com base no rider, cidades disponíveis e Índice de Acendimento Cultural.
                Escolha a rota que melhor atende aos seus objetivos.
              </p>
              <div className="grid gap-4 xl:grid-cols-2">
                {routes.map((route) => (
                  <article
                    key={route.label}
                    className={`rounded-2xl border-2 p-5 transition hover:shadow-md ${
                      selectedRoute?.label === route.label
                        ? 'border-[var(--color-secondary-300)]'
                        : 'border-[var(--color-cream-dark)]'
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="font-display text-lg">{route.label}</strong>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${route.tagColor}`}>
                            {route.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[var(--color-warm-gray)]">{route.description}</p>
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="rounded-xl bg-[var(--color-cream)] p-2">
                        <p className="text-xs text-[var(--color-warm-gray)]">Custo total</p>
                        <strong>{formatCurrency(route.totalCost)}</strong>
                      </div>
                      <div className="rounded-xl bg-[var(--color-cream)] p-2">
                        <p className="text-xs text-[var(--color-warm-gray)]">Por apresentação</p>
                        <strong>{formatCurrency(route.costPerShow)}</strong>
                      </div>
                      <div className="rounded-xl bg-[var(--color-cream)] p-2">
                        <p className="text-xs text-[var(--color-warm-gray)]">Por espectador</p>
                        <strong>{formatCurrency(route.costPerSpectator)}</strong>
                      </div>
                      <div className="rounded-xl bg-[var(--color-cream)] p-2">
                        <p className="text-xs text-[var(--color-warm-gray)]">Público estimado</p>
                        <strong>{route.estimatedAudience.toLocaleString('pt-BR')}</strong>
                      </div>
                    </div>
                    <div className="mb-3 text-xs text-[var(--color-warm-gray)]">
                      <span>
                        {route.citiesCount} cidades · {route.localTechnicians} técnicos locais disponíveis
                      </span>
                      <br />
                      <span className="font-bold text-[var(--color-success)]">
                        Economia de {route.savingsPercent}% vs. circulação individual
                      </span>
                    </div>
                    <p className="mb-3 text-xs text-[var(--color-warm-gray)]">
                      Paradas: {route.cities.join(' → ')}
                    </p>
                    <Button onClick={() => chooseRoute(route)}>Escolher esta rota</Button>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Confirmar */}
          {step === 4 && selectedRoute && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-[var(--color-cream)] p-5">
                <h3 className="mb-3 font-bold">Resumo da proposta</h3>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <p className="text-xs text-[var(--color-warm-gray)]">Espetáculo</p>
                    <strong>{currentShow.name}</strong>
                    <p className="text-sm text-[var(--color-warm-gray)]">{currentShow.group}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-warm-gray)]">Rota escolhida</p>
                    <strong>{selectedRoute.label} — {selectedRoute.tag}</strong>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-warm-gray)]">Paradas</p>
                    <strong>{selectedRoute.cities.join(' · ')}</strong>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-warm-gray)]">Custo total estimado</p>
                    <strong>{formatCurrency(selectedRoute.totalCost)}</strong>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-warm-gray)]">Contratantes convidados</p>
                    <p className="text-sm">{selectedRoute.contractors.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-warm-gray)]">Economia estimada</p>
                    <strong className="text-[var(--color-success)]">
                      {selectedRoute.savingsPercent}% vs. circulação individual
                    </strong>
                  </div>
                </div>
              </div>
              {opportunity && (
                <div className="rounded-2xl border border-[var(--color-secondary-300)] bg-[var(--color-secondary-50)] p-4 text-sm">
                  <strong>Iniciado a partir de oportunidade automática</strong>
                  <p className="text-[var(--color-warm-gray)]">
                    {opportunity.unitsInterested} unidades já demonstraram interesse em {opportunity.period}.
                  </p>
                </div>
              )}
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(3)}>
                  Voltar
                </Button>
                <Button onClick={publish}>Publicar e enviar convites</Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
