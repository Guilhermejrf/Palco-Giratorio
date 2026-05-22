import { Bed, Boxes, Headphones, Hotel, Lightbulb, MapPinned, Star, Truck } from 'lucide-react'
import type { Resource } from '../../../types/resource.types'
import { formatCurrency } from '../../../utils/formatters'
import { Button } from '../../ui/Button/Button'
import { Card } from '../../ui/Card/Card'

const iconByType = {
  Som: Headphones,
  Luz: Lightbulb,
  Palco: Boxes,
  Transporte: Truck,
  Hospedagem: Hotel,
  Técnicos: Star,
  Espaços: Bed,
  Outros: MapPinned,
}

const availabilityLabel = {
  available: 'Disponível',
  busy: 'Ocupado',
  by_schedule: 'Por agendamento',
}

interface ResourceCardProps {
  resource: Resource
  onRequest: (resource: Resource) => void
}

export const ResourceCard = ({ resource, onRequest }: ResourceCardProps) => {
  const Icon = iconByType[resource.type]
  return (
    <Card>
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-blue-100)] text-[var(--color-blue-500)]">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold leading-tight">{resource.name}</h3>
          <p className="text-sm text-[var(--color-warm-gray)]">
            {resource.type} · {resource.city}
          </p>
        </div>
      </div>
      <p className="text-sm text-[var(--color-warm-gray)]">Responsável: {resource.owner}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
            resource.availability === 'available'
              ? 'bg-[#C8DBC8] text-[var(--color-primary-700)]'
              : resource.availability === 'busy'
                ? 'bg-[var(--color-accent-100)] text-[var(--color-danger)]'
                : 'bg-[#FAD4A0] text-[var(--color-charcoal)]'
          }`}
        >
          {availabilityLabel[resource.availability]}
        </span>
        <strong className="text-sm">
          {resource.networkShared ? 'Cedido pela rede' : formatCurrency(resource.pricePerDay ?? 0)}
        </strong>
      </div>
      <Button className="mt-5 w-full" onClick={() => onRequest(resource)} variant="secondary">
        Solicitar
      </Button>
    </Card>
  )
}
