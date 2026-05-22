import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CircuitCard } from '../../../components/circuits/CircuitCard/CircuitCard'
import { OpportunityCard } from '../../../components/circuits/OpportunityCard/OpportunityCard'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { Button } from '../../../components/ui/Button/Button'
import { Tabs } from '../../../components/ui/Tabs/Tabs'
import { circuits, opportunities } from '../../../constants/mockData'

const tabs = ['Em andamento', 'Planejados', 'Oportunidades', 'Encerrados']

export const CircuitosList = () => {
  const [active, setActive] = useState(tabs[0])
  const [ignoredOpportunities, setIgnoredOpportunities] = useState<string[]>([])
  const filtered = circuits.filter((circuit) => {
    if (active === 'Em andamento') return circuit.status === 'IN_PROGRESS'
    if (active === 'Planejados') return circuit.status === 'PLANNING' || circuit.status === 'OPEN'
    if (active === 'Encerrados') return circuit.status === 'COMPLETED'
    return true
  })

  return (
    <div>
      <PageHeader
        title="Circuitos"
        subtitle="Turnês colaborativas com divisão de custos, rotas otimizadas e recursos locais."
        decorativeShape="semicircle"
        decorativeColor="var(--color-secondary-100)"
        actions={
          <Link to="/circuitos/novo">
            <Button icon={<Plus className="h-4 w-4" />}>Novo circuito</Button>
          </Link>
        }
      />
      <div className="space-y-5 p-4 md:p-8">
        <Tabs active={active} onChange={setActive} tabs={tabs} />
        {active === 'Oportunidades' ? (
          <div className="grid gap-4 lg:grid-cols-3">
            {opportunities
              .filter((opportunity) => !ignoredOpportunities.includes(opportunity.id))
              .map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onIgnore={(id) => setIgnoredOpportunities((current) => [...current, id])}
                />
              ))}
          </div>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {filtered.map((circuit) => (
              <CircuitCard key={circuit.id} circuit={circuit} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
