import { useNearbySchools } from '../../../hooks/useNearbySchools'
import { Button } from '../../ui/Button/Button'
import toast from 'react-hot-toast'

export const SchoolNearCircuit = () => {
  const { data = [] } = useNearbySchools()
  return (
    <div className="space-y-3">
      {data.map((school) => (
        <article key={school.id} className="rounded-2xl border border-[var(--color-cream-dark)] p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold">{school.name}</h3>
              <p className="text-xs text-[var(--color-warm-gray)]">
                {school.city} · {school.students} alunos
              </p>
            </div>
            <Button
              onClick={() => toast.success(`${school.name} incluída na agenda do circuito.`)}
              variant="secondary"
            >
              Incluir
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}
