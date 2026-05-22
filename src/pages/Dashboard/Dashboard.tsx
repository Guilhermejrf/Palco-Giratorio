import { BarChart2, MapPin, Route, Theater, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CircuitCard } from '../../components/circuits/CircuitCard/CircuitCard'
import { OpportunityCard } from '../../components/circuits/OpportunityCard/OpportunityCard'
import { MapVivo } from '../../components/map/MapVivo/MapVivo'
import { PulseIndexCard } from '../../components/metrics/PulseIndexCard/PulseIndexCard'
import { Button } from '../../components/ui/Button/Button'
import { Card } from '../../components/ui/Card/Card'
import { circuits, opportunities, shows } from '../../constants/mockData'
import { municipalities } from '../../constants/municipalities'
import { useAuthStore } from '../../stores/authStore'

export const Dashboard = () => {
  const user = useAuthStore((state) => state.user)
  const inactiveCities = municipalities.filter((city) => city.status === 'off').length
  const activeCities = municipalities.filter((city) => city.status !== 'off').length
  const activeCircuits = circuits.filter((circuit) => circuit.status === 'IN_PROGRESS')
  const lowPulse = [...municipalities].sort((a, b) => a.pulseIndex - b.pulseIndex).slice(0, 5)

  return (
    <div className="space-y-6 p-4 md:p-8">
      <section className="relative overflow-hidden rounded-3xl bg-[var(--color-primary-700)] p-6 text-white md:p-8">
        <h1 className="max-w-4xl font-display text-3xl md:text-[52px]">
          Bom dia, {user?.name}. Pernambuco tem {inactiveCities} municípios apagados este mês.
        </h1>
        <p className="mt-4 max-w-2xl text-white/75">
          O mapa está acendendo onde a circulação acontece, e mostrando onde a próxima rota pode nascer.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PulseIndexCard icon={MapPin} label="Municípios ativos este mês" value={activeCities} delta="+12%" />
        <PulseIndexCard icon={Route} label="Circuitos em andamento" value={activeCircuits.length} delta="+8%" />
        <PulseIndexCard icon={Theater} label="Espetáculos cadastrados" value={shows.length} delta="+15%" />
        <PulseIndexCard icon={Users} label="Custo médio por espectador" value="R$ 18,90" delta="-9%" />
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card interactive={false}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl">Mapa aceso agora</h2>
            <Link to="/mapa">
              <Button variant="secondary">Ver mapa completo</Button>
            </Link>
          </div>
          <div className="h-[320px] overflow-hidden rounded-2xl">
            <MapVivo compact />
          </div>
        </Card>
        <Card interactive={false}>
          <h2 className="mb-4 font-display text-2xl">Municípios prioritários</h2>
          <div className="space-y-3">
            {lowPulse.map((city) => (
              <div key={city.id} className="flex items-center justify-between rounded-xl bg-[var(--color-cream)] p-3">
                <div>
                  <strong>{city.name}</strong>
                  <p className="text-xs text-[var(--color-warm-gray)]">
                    {city.region} · último evento há {city.daysSinceLastEvent} dias
                  </p>
                </div>
                <span className="font-mono text-lg font-bold">{city.pulseIndex}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section>
        <h2 className="mb-4 font-display text-2xl">Oportunidades da semana</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </section>
      <section>
        <div className="mb-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-[var(--color-secondary-300)]" />
          <h2 className="font-display text-2xl">Circuitos ativos agora</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {activeCircuits.map((circuit) => (
            <CircuitCard key={circuit.id} circuit={circuit} />
          ))}
        </div>
      </section>
    </div>
  )
}
