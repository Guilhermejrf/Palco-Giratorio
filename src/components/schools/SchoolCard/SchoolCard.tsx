import { CalendarPlus, GraduationCap, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import type { School } from '../../../types/school.types'
import { Badge } from '../../ui/Badge/Badge'
import { Button } from '../../ui/Button/Button'
import { Card } from '../../ui/Card/Card'

interface SchoolCardProps {
  school: School
  onOpenConversation: (school: School) => void
}

export const SchoolCard = ({ school, onOpenConversation }: SchoolCardProps) => {
  const navigate = useNavigate()

  const addToRoute = () => {
    toast.success(`${school.name} adicionada como parada formativa sugerida.`)
    navigate('/circuitos/novo', { state: { schoolId: school.id } })
  }

  return (
    <Card>
      <div className="mb-4 flex items-start gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--color-primary-100)] text-[var(--color-primary-700)]">
          <GraduationCap className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-display text-xl leading-tight">{school.name}</h3>
          <p className="flex items-center gap-1 text-sm text-[var(--color-warm-gray)]">
            <MapPin className="h-3.5 w-3.5" /> {school.city}
          </p>
        </div>
      </div>
      <p className="text-sm text-[var(--color-warm-gray)]">
        {school.students} alunos · {school.ageRange}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {school.interests.map((interest) => (
          <Badge key={interest} className="bg-[var(--color-accent-100)] text-[var(--color-accent-500)]">
            {interest}
          </Badge>
        ))}
        {school.neverServed ? (
          <Badge className="bg-[var(--color-danger)] text-white">Nunca atendida</Badge>
        ) : (
          <Badge className="bg-[var(--color-cream)] text-[var(--color-warm-gray)]">
            Última visita: {school.lastVisitMonths} meses
          </Badge>
        )}
      </div>
      <p className="mt-3 text-xs text-[var(--color-warm-gray)]">{school.structures.join(' · ')}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button icon={<CalendarPlus className="h-4 w-4" />} onClick={addToRoute} variant="secondary">
          Incluir na rota
        </Button>
        <Button onClick={() => onOpenConversation(school)} variant="ghost">
          Abrir tratativa
        </Button>
      </div>
    </Card>
  )
}
