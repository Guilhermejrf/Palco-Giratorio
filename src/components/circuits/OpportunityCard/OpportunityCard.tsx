import { Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import type { CircuitOpportunity } from '../../../types/circuit.types'
import { Button } from '../../ui/Button/Button'
import { Card } from '../../ui/Card/Card'

interface OpportunityCardProps {
  opportunity: CircuitOpportunity
  onIgnore?: (id: string) => void
}

export const OpportunityCard = ({ opportunity, onIgnore }: OpportunityCardProps) => {
  const navigate = useNavigate()

  const createCircuit = () => {
    toast.success(`Circuito iniciado a partir de ${opportunity.showName}.`)
    navigate('/circuitos/novo', { state: { opportunityId: opportunity.id } })
  }

  const ignoreOpportunity = () => {
    toast('Oportunidade arquivada para esta semana.')
    onIgnore?.(opportunity.id)
  }

  return (
    <Card className="bg-[var(--color-secondary-50)]">
      <div className="mb-3 flex items-center gap-2 text-[var(--color-secondary-500)]">
        <Sparkles className="h-5 w-5" />
        <strong>Sistema identificou oportunidade</strong>
      </div>
      <p className="text-sm">
        {opportunity.unitsInterested} unidades têm interesse em <strong>{opportunity.showName}</strong> para{' '}
        {opportunity.period}.
      </p>
      <p className="mt-2 text-sm text-[var(--color-warm-gray)]">
        {opportunity.municipalities.join(', ')} · economia estimada de {opportunity.estimatedSavings}%.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={createCircuit}>Criar circuito</Button>
        <Button onClick={ignoreOpportunity} variant="ghost">
          Ignorar
        </Button>
      </div>
    </Card>
  )
}
