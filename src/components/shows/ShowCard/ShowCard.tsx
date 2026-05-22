import { CalendarPlus, FileText, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { LANGUAGE_BADGE_CLASS } from '../../../constants/languages'
import { useAuthStore } from '../../../stores/authStore'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import type { Show } from '../../../types/show.types'
import { formatCurrency } from '../../../utils/formatters'
import { Badge } from '../../ui/Badge/Badge'
import { Button } from '../../ui/Button/Button'
import { Card } from '../../ui/Card/Card'
import { DecorativeShape } from '../../ui/DecorativeShape/DecorativeShape'

interface ShowCardProps {
  show: Show
  onRider: (show: Show) => void
}

export const ShowCard = ({ show, onRider }: ShowCardProps) => {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const showInterests = useDemoDataStore((state) => state.showInterests)
  const registerShowInterest = useDemoDataStore((state) => state.registerShowInterest)

  const interestCount = showInterests.filter((i) => i.showId === show.id).length
  const alreadyInterested = showInterests.some(
    (i) => i.showId === show.id && i.spaceName === (user?.organization ?? 'Sesc Pernambuco'),
  )

  const includeInCircuit = () => {
    toast.success(`${show.name} selecionado para novo circuito.`)
    navigate('/circuitos/novo', { state: { showId: show.id } })
  }

  const handleInterest = () => {
    if (alreadyInterested) {
      toast('Sua unidade já demonstrou interesse neste espetáculo.')
      return
    }
    registerShowInterest(
      show.id,
      show.name,
      user?.organization ?? 'Sesc Pernambuco',
      user?.city ?? 'Recife',
      'Período a definir',
    )
    toast.success(`Interesse registrado! O grupo e outras unidades foram notificados.`)
  }

  return (
    <Card className="group overflow-hidden p-0 hover:border-[var(--color-primary-300)]">
      <div className="relative min-h-36 overflow-hidden bg-[var(--color-secondary-50)] p-5">
        <DecorativeShape
          shape="semicircle"
          size={180}
          color="var(--color-primary-100)"
          className="-bottom-16 -right-8"
        />
        <p className="relative z-10 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-secondary-500)]">
          {show.group}
        </p>
        <h3 className="relative z-10 mt-2 font-display text-2xl leading-tight">{show.name}</h3>
        {interestCount > 0 && (
          <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-[var(--color-secondary-500)]">
            <Sparkles className="h-3 w-3" />
            {interestCount} {interestCount === 1 ? 'unidade' : 'unidades'}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {show.languages.map((language) => (
            <Badge key={language} className={LANGUAGE_BADGE_CLASS[language]}>
              {language}
            </Badge>
          ))}
          <Badge className="bg-[var(--color-cream)] text-[var(--color-warm-gray)]">
            {show.minAge === 0 ? 'Livre' : `${show.minAge}+`}
          </Badge>
          {show.hasWorkshop && (
            <Badge className="bg-[var(--color-accent-200)] text-[var(--color-primary-700)]">Oficina</Badge>
          )}
        </div>
        <p className="line-clamp-3 text-sm text-[var(--color-warm-gray)]">{show.synopsis}</p>
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-[var(--color-warm-gray)]">Origem</dt>
            <dd className="font-bold">{show.originCity}</dd>
          </div>
          <div>
            <dt className="text-xs text-[var(--color-warm-gray)]">Cachê mínimo</dt>
            <dd className="font-bold">{formatCurrency(show.minFee)}</dd>
          </div>
        </dl>
        <div className="mt-5 flex flex-wrap gap-2">
          <Button icon={<FileText className="h-4 w-4" />} onClick={() => onRider(show)} variant="secondary">
            Ver Rider
          </Button>
          <Button
            icon={<Sparkles className="h-4 w-4" />}
            onClick={handleInterest}
            variant={alreadyInterested ? 'ghost' : 'secondary'}
          >
            {alreadyInterested ? 'Interesse registrado' : 'Demonstrar interesse'}
          </Button>
          <Button icon={<CalendarPlus className="h-4 w-4" />} onClick={includeInCircuit} variant="ghost">
            Incluir em circuito
          </Button>
        </div>
      </div>
    </Card>
  )
}
