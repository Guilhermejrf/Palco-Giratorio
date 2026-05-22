import toast from 'react-hot-toast'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { Button } from '../../ui/Button/Button'

export const SchoolNearCircuit = () => {
  const schools = useDemoDataStore((state) => state.schools)
  const includedSchoolIds = useDemoDataStore((state) => state.includedSchoolIds)
  const includeSchoolInCircuit = useDemoDataStore((state) => state.includeSchoolInCircuit)
  const data = schools.filter((school) => school.region === 'Agreste' || school.neverServed)

  return (
    <div className="space-y-3">
      {data.map((school) => {
        const included = includedSchoolIds.includes(school.id)

        return (
          <article key={school.id} className="rounded-2xl border border-[var(--color-cream-dark)] p-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">{school.name}</h3>
                <p className="text-xs text-[var(--color-warm-gray)]">
                  {school.city} · {school.students} alunos
                </p>
              </div>
              <Button
                disabled={included}
                onClick={() => {
                  includeSchoolInCircuit(school.id)
                  toast.success(`${school.name} incluída no mapa do circuito.`)
                }}
                variant="secondary"
              >
                {included ? 'No mapa' : 'Incluir'}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
