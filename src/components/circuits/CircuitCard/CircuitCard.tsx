import { Link } from 'react-router-dom'
import type { Circuit } from '../../../types/circuit.types'
import { formatCurrency, formatDate } from '../../../utils/formatters'
import { Badge } from '../../ui/Badge/Badge'
import { Button } from '../../ui/Button/Button'
import { Card } from '../../ui/Card/Card'

const statusLabel: Record<Circuit['status'], string> = {
  IN_PROGRESS: 'Em andamento',
  PLANNING: 'Planejado',
  OPEN: 'Aberto',
  COMPLETED: 'Encerrado',
}

export const CircuitCard = ({ circuit }: { circuit: Circuit }) => {
  const progress = Math.round((circuit.confirmedStops / circuit.stops.length) * 100)
  return (
    <Card className={circuit.status === 'IN_PROGRESS' ? 'border-l-4 border-l-[var(--color-secondary-300)]' : ''}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl">{circuit.name}</h3>
          <p className="text-sm text-[var(--color-warm-gray)]">{circuit.region}</p>
        </div>
        <Badge className="bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
          {statusLabel[circuit.status]}
        </Badge>
      </div>
      <p className="text-sm">
        <strong>{circuit.showName}</strong> · {circuit.group}
      </p>
      <p className="text-sm text-[var(--color-warm-gray)]">
        {formatDate(circuit.startDate)} até {formatDate(circuit.endDate)} · {circuit.stops.length} paradas
      </p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold">
          <span>
            {circuit.confirmedStops} de {circuit.stops.length} apresentações confirmadas
          </span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[var(--color-cream-dark)]">
          <div className="h-2 rounded-full bg-[var(--color-secondary-300)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-[var(--color-warm-gray)]">Custo total</p>
          <strong>{formatCurrency(circuit.totalCost)}</strong>
        </div>
        <Link to={`/circuitos/${circuit.id}`}>
          <Button variant="secondary">Ver detalhes</Button>
        </Link>
      </div>
    </Card>
  )
}
