import {
  Calculator,
  CheckCircle2,
  FileText,
  GraduationCap,
  Package,
  Route,
  Sparkles,
  TrendingDown,
  Users,
  XCircle,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Button } from '../../components/ui/Button/Button'
import { Card } from '../../components/ui/Card/Card'
import { municipalities } from '../../constants/municipalities'
import { useDemoDataStore, type NetworkEvent } from '../../stores/demoDataStore'
import { useAuthStore } from '../../stores/authStore'
import { formatCurrency } from '../../utils/formatters'

const eventIcon: Record<NetworkEvent['type'], React.ElementType> = {
  circuit_proposed: Route,
  contractor_confirmed: CheckCircle2,
  contractor_declined: XCircle,
  school_joined: GraduationCap,
  interest_registered: Sparkles,
  consolidation_created: Package,
  resource_shared: Package,
  post_presentation: Users,
}

const eventColor: Record<NetworkEvent['type'], string> = {
  circuit_proposed: 'bg-[var(--color-primary-100)] text-[var(--color-primary-700)]',
  contractor_confirmed: 'bg-[var(--color-accent-200)] text-[var(--color-primary-700)]',
  contractor_declined: 'bg-[var(--color-accent-100)] text-[var(--color-danger)]',
  school_joined: 'bg-[var(--color-secondary-50)] text-[var(--color-secondary-500)]',
  interest_registered: 'bg-[var(--color-accent-100)] text-[var(--color-secondary-500)]',
  consolidation_created: 'bg-[var(--color-cream)] text-[var(--color-charcoal)]',
  resource_shared: 'bg-[var(--color-cream)] text-[var(--color-charcoal)]',
  post_presentation: 'bg-[var(--color-cream)] text-[var(--color-primary-700)]',
}

const eventLabel: Record<NetworkEvent['type'], string> = {
  circuit_proposed: 'Proposta',
  contractor_confirmed: 'Confirmação',
  contractor_declined: 'Recusa',
  school_joined: 'Escola',
  interest_registered: 'Interesse',
  consolidation_created: 'Consolidação',
  resource_shared: 'Recurso',
  post_presentation: 'Impacto',
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) +
    ' · ' +
    d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const lowPulse = [...municipalities].filter((m) => m.pulseIndex < 30)

export const Rede = () => {
  const user = useAuthStore((state) => state.user)
  const networkFeed = useDemoDataStore((state) => state.networkFeed)
  const showInterests = useDemoDataStore((state) => state.showInterests)
  const shows = useDemoDataStore((state) => state.shows)
  const opportunities = useDemoDataStore((state) => state.opportunities)
  const registerShowInterest = useDemoDataStore((state) => state.registerShowInterest)

  const [filterType, setFilterType] = useState<NetworkEvent['type'] | ''>('')
  const [interestShowId, setInterestShowId] = useState('')
  const [interestPeriod, setInterestPeriod] = useState('')

  const filtered = filterType ? networkFeed.filter((e) => e.type === filterType) : networkFeed
  const blockSuggestions = opportunities.map((opportunity) => {
    const show = shows.find((item) => item.name === opportunity.showName)
    const units = Math.max(opportunity.unitsInterested, 1)
    const individualCost = Math.round(units * ((show?.minFee ?? 7800) + 6500))
    const blockCost = Math.round(individualCost * (1 - opportunity.estimatedSavings / 100))
    const perUnit = Math.round(blockCost / units)

    return { ...opportunity, show, units, individualCost, blockCost, perUnit }
  })

  const alreadyInterested = (showId: string) =>
    showInterests.some(
      (i) => i.showId === showId && i.spaceName === (user?.organization ?? 'Sesc Pernambuco'),
    )

  const submitInterest = () => {
    const show = shows.find((s) => s.id === interestShowId)
    if (!show || !interestPeriod) {
      toast.error('Selecione um espetáculo e informe o período de interesse.')
      return
    }
    registerShowInterest(
      show.id,
      show.name,
      user?.organization ?? 'Sesc Pernambuco',
      user?.city ?? 'Recife',
      interestPeriod,
    )
    toast.success('Interesse registrado. O grupo e outros espaços da rota foram notificados.')
    setInterestShowId('')
    setInterestPeriod('')
  }

  return (
    <div>
      <PageHeader
        title="Contratação em Bloco"
        subtitle="Interesses simultâneos, blocos sugeridos e negociações coletivas para reduzir custos de circulação."
        decorativeShape="star"
        decorativeColor="var(--color-secondary-100)"
      />
      <div className="space-y-6 p-4 md:p-8">
        <section className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl">Blocos sugeridos</h2>
              <p className="text-sm text-[var(--color-warm-gray)]">
                Grupos com demanda simultânea e economia estimada para contratação coletiva.
              </p>
            </div>
            <div className="flex gap-2 text-sm">
              <span className="rounded-full bg-white px-3 py-2 font-bold">
                {blockSuggestions.length} blocos
              </span>
              <span className="rounded-full bg-[var(--color-accent-100)] px-3 py-2 font-bold text-[var(--color-secondary-500)]">
                até {Math.max(...blockSuggestions.map((item) => item.estimatedSavings), 0)}% economia
              </span>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            {blockSuggestions.map((block) => (
              <Card key={block.id} className="border-l-4 border-l-[var(--color-secondary-300)]" interactive={false}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-secondary-500)]">
                      {block.region}
                    </p>
                    <h3 className="font-display text-xl leading-tight">{block.showName}</h3>
                    <p className="mt-1 text-sm text-[var(--color-warm-gray)]">{block.group}</p>
                  </div>
                  <span className="rounded-full bg-[var(--color-accent-200)] px-2.5 py-1 text-xs font-bold text-[var(--color-primary-700)]">
                    -{block.estimatedSavings}%
                  </span>
                </div>

                <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
                  <div className="rounded-xl bg-[var(--color-cream)] p-3">
                    <Users className="mb-2 h-4 w-4 text-[var(--color-secondary-300)]" />
                    <p className="text-xs text-[var(--color-warm-gray)]">Unidades</p>
                    <strong>{block.units}</strong>
                  </div>
                  <div className="rounded-xl bg-[var(--color-cream)] p-3">
                    <TrendingDown className="mb-2 h-4 w-4 text-[var(--color-secondary-300)]" />
                    <p className="text-xs text-[var(--color-warm-gray)]">Total</p>
                    <strong>{formatCurrency(block.blockCost)}</strong>
                  </div>
                  <div className="rounded-xl bg-[var(--color-cream)] p-3">
                    <Calculator className="mb-2 h-4 w-4 text-[var(--color-secondary-300)]" />
                    <p className="text-xs text-[var(--color-warm-gray)]">Por unidade</p>
                    <strong>{formatCurrency(block.perUnit)}</strong>
                  </div>
                </div>

                <div className="mb-4 rounded-xl border border-[var(--color-cream-dark)] p-3 text-sm">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[var(--color-warm-gray)]">Contratação isolada</span>
                    <strong>{formatCurrency(block.individualCost)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[var(--color-warm-gray)]">Contratação em bloco</span>
                    <strong className="text-[var(--color-secondary-500)]">{formatCurrency(block.blockCost)}</strong>
                  </div>
                </div>

                <p className="mb-4 text-sm text-[var(--color-warm-gray)]">
                  {block.municipalities.join(', ')} · {block.period}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link to="/circuitos/novo" state={{ opportunityId: block.id }}>
                    <Button>Montar bloco</Button>
                  </Link>
                  <Link to="/circuitos">
                    <Button icon={<FileText className="h-4 w-4" />} variant="secondary">
                      Ver circuitos
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Feed principal */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-2xl">Atividade recente</h2>
            <p className="text-sm text-[var(--color-warm-gray)]">
              Confirmações, interesses e movimentações que alimentam os blocos.
            </p>
          </div>
          {/* Filtros do feed */}
          <div className="flex flex-wrap gap-2">
            <button
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${!filterType ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white hover:bg-[var(--color-cream)]'}`}
              onClick={() => setFilterType('')}
              type="button"
            >
              Tudo
            </button>
            {(
              [
                ['circuit_proposed', 'Propostas'],
                ['contractor_confirmed', 'Confirmações'],
                ['interest_registered', 'Interesses'],
                ['school_joined', 'Escolas'],
                ['post_presentation', 'Impacto'],
                ['consolidation_created', 'Logística'],
              ] as [NetworkEvent['type'], string][]
            ).map(([type, label]) => (
              <button
                key={type}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${filterType === type ? 'bg-[var(--color-primary-700)] text-white' : 'bg-white hover:bg-[var(--color-cream)]'}`}
                onClick={() => setFilterType(type)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Eventos */}
          <div className="space-y-3">
            {filtered.map((event) => {
              const Icon = eventIcon[event.type]
              return (
                <article
                  key={event.id}
                  className="flex gap-4 rounded-2xl border border-[var(--color-cream-dark)] bg-white p-4"
                >
                  <div
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${eventColor[event.type]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${eventColor[event.type]}`}
                      >
                        {eventLabel[event.type]}
                      </span>
                      <strong className="text-sm">{event.actor}</strong>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-warm-gray)]">{event.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      <span className="text-xs text-[var(--color-warm-gray)]">{formatTime(event.createdAt)}</span>
                      {event.circuitId && (
                        <Link
                          to={`/circuitos/${event.circuitId}`}
                          className="text-xs font-bold text-[var(--color-secondary-500)] hover:underline"
                        >
                          Ver circuito →
                        </Link>
                      )}
                      {event.showId && (
                        <Link
                          to={`/espetaculos/${event.showId}`}
                          className="text-xs font-bold text-[var(--color-secondary-500)] hover:underline"
                        >
                          Ver espetáculo →
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              )
            })}
            {filtered.length === 0 && (
              <p className="rounded-2xl bg-white p-6 text-sm text-[var(--color-warm-gray)]">
                Nenhum evento deste tipo ainda.
              </p>
            )}
          </div>
        </section>

        {/* Painel lateral */}
        <aside className="space-y-5">
          {/* Registrar interesse */}
          <Card interactive={false}>
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--color-secondary-300)]" />
              <h2 className="font-display text-lg">Registrar interesse no bloco</h2>
            </div>
            <p className="mb-4 text-sm text-[var(--color-warm-gray)]">
              Mostre ao grupo que sua unidade quer receber o espetáculo. Quando mais espaços demonstrarem
              interesse, o sistema propõe automaticamente um bloco de contratação.
            </p>
            <div className="space-y-3">
              <select
                className="h-10 w-full rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-3 text-sm"
                value={interestShowId}
                onChange={(e) => setInterestShowId(e.target.value)}
              >
                <option value="">Selecione um espetáculo...</option>
                {shows.map((show) => (
                  <option key={show.id} value={show.id} disabled={alreadyInterested(show.id)}>
                    {show.name} {alreadyInterested(show.id) ? '(já demonstrado)' : ''}
                  </option>
                ))}
              </select>
              <input
                className="h-10 w-full rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-3 text-sm"
                placeholder="Período de interesse (ex: julho/2026)"
                value={interestPeriod}
                onChange={(e) => setInterestPeriod(e.target.value)}
              />
              <Button className="w-full" onClick={submitInterest}>
                Registrar interesse
              </Button>
            </div>

            {/* Interesses registrados por espetáculo */}
            {shows
              .filter((show) => showInterests.some((i) => i.showId === show.id))
              .map((show) => {
                const interests = showInterests.filter((i) => i.showId === show.id)
                return (
                  <div key={show.id} className="mt-4 rounded-xl bg-[var(--color-cream)] p-3 text-sm">
                    <strong>{show.name}</strong>
                    <p className="mt-1 text-xs text-[var(--color-warm-gray)]">
                      {interests.length} {interests.length === 1 ? 'unidade demonstrou' : 'unidades demonstraram'} interesse
                    </p>
                    <ul className="mt-2 space-y-1">
                      {interests.map((i) => (
                        <li key={i.id} className="text-xs">
                          · {i.spaceName} ({i.spaceCity}) — {i.period}
                        </li>
                      ))}
                    </ul>
                    {interests.length >= 2 && (
                      <Link to="/circuitos/novo" state={{ showId: show.id }}>
                        <Button className="mt-3 w-full" variant="secondary">
                          Transformar em bloco →
                        </Button>
                      </Link>
                    )}
                  </div>
                )
              })}
          </Card>

          {/* Municípios que precisam de atenção */}
          <Card interactive={false}>
            <div className="mb-3 flex items-center gap-2">
              <Zap className="h-5 w-5 text-[var(--color-warning)]" />
              <h2 className="font-display text-lg">Precisam de circulação</h2>
            </div>
            <p className="mb-3 text-sm text-[var(--color-warm-gray)]">
              Municípios com Índice de Acendimento Cultural abaixo de 30. Quem agenda aqui contribui para equilibrar o
              ecossistema.
            </p>
            <div className="space-y-2">
              {lowPulse.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between rounded-xl border border-[var(--color-cream-dark)] p-3"
                >
                  <div>
                    <p className="text-sm font-bold">{city.name}</p>
                    <p className="text-xs text-[var(--color-warm-gray)]">
                      {city.region} · {city.daysSinceLastEvent} dias sem evento
                    </p>
                  </div>
                  <span className="font-mono text-lg font-bold text-[var(--color-warning)]">
                    {city.pulseIndex}
                  </span>
                </div>
              ))}
            </div>
            <Link to="/metricas">
              <Button className="mt-4 w-full" variant="secondary">
                Ver IAC completo
              </Button>
            </Link>
          </Card>
        </aside>
        </div>
      </div>
    </div>
  )
}
