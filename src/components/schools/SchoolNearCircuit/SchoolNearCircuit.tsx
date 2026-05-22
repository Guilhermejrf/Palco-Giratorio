import toast from 'react-hot-toast'
import { useDemoDataStore } from '../../../stores/demoDataStore'
import { Button } from '../../ui/Button/Button'

interface SchoolNearCircuitProps {
  circuitId?: string
  onPropose?: (schoolId: string, schoolName: string) => void
}

export const SchoolNearCircuit = ({ circuitId, onPropose }: SchoolNearCircuitProps) => {
  const schools = useDemoDataStore((state) => state.schools)
  const includedSchoolIds = useDemoDataStore((state) => state.includedSchoolIds)
  const schoolProposals = useDemoDataStore((state) => state.schoolProposals)
  const includeSchoolInCircuit = useDemoDataStore((state) => state.includeSchoolInCircuit)
  const data = schools.filter((school) => school.region === 'Agreste' || school.neverServed)

  return (
    <div className="space-y-3">
      {data.map((school) => {
        const included = includedSchoolIds.includes(school.id)
        const alreadyProposed = circuitId
          ? schoolProposals.some((p) => p.schoolId === school.id && p.circuitId === circuitId)
          : false

        return (
          <article key={school.id} className="rounded-2xl border border-[var(--color-cream-dark)] p-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold">{school.name}</h3>
                <p className="text-xs text-[var(--color-warm-gray)]">
                  {school.city} · {school.students} alunos
                </p>
                {school.interests.length > 0 && (
                  <p className="mt-1 text-xs text-[var(--color-warm-gray)]">
                    Interesses: {school.interests.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  disabled={included}
                  onClick={() => {
                    includeSchoolInCircuit(school.id)
                    toast.success(`${school.name} incluída no mapa do circuito.`)
                  }}
                  variant="secondary"
                >
                  {included ? 'No mapa' : 'Incluir no mapa'}
                </Button>
                {onPropose && (
                  <Button
                    disabled={alreadyProposed}
                    onClick={() => onPropose(school.id, school.name)}
                    variant="ghost"
                  >
                    {alreadyProposed ? 'Proposta enviada' : 'Propor visita'}
                  </Button>
                )}
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
