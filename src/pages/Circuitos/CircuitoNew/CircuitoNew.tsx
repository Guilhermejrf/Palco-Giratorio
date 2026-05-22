import { useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader'
import { Button } from '../../../components/ui/Button/Button'
import { Card } from '../../../components/ui/Card/Card'
import { municipalities } from '../../../constants/municipalities'
import { useDemoDataStore } from '../../../stores/demoDataStore'

export const CircuitoNew = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as { showId?: string; municipalityId?: string; schoolId?: string; opportunityId?: string } | null
  const shows = useDemoDataStore((store) => store.shows)
  const schools = useDemoDataStore((store) => store.schools)
  const opportunities = useDemoDataStore((store) => store.opportunities)
  const addCircuit = useDemoDataStore((store) => store.addCircuit)
  const opportunity = opportunities.find((item) => item.id === state?.opportunityId)
  const opportunityShow = shows.find((show) => show.name === opportunity?.showName)
  const schoolCity = schools.find((school) => school.id === state?.schoolId)?.city
  const schoolMunicipality = municipalities.find((city) => city.name === schoolCity)
  const initialShowId = state?.showId ?? opportunityShow?.id ?? shows[0].id
  const initialCities = state?.municipalityId
    ? [state.municipalityId]
    : schoolMunicipality
      ? [schoolMunicipality.id]
      : opportunity
        ? (opportunity.municipalities
            .map((name) => municipalities.find((city) => city.name === name)?.id)
            .filter(Boolean) as string[])
        : ['caruaru', 'arcoverde']
  const [step, setStep] = useState(1)
  const [selectedShow, setSelectedShow] = useState(initialShowId)
  const [selectedCities, setSelectedCities] = useState<string[]>(initialCities)
  const [selectedContractors, setSelectedContractors] = useState([
    'Sesc Caruaru',
    'Sesc Arcoverde',
    'Prefeitura de Olinda',
    'Escola Mestre Vitalino',
  ])

  const toggleCity = (cityId: string) => {
    setSelectedCities((current) =>
      current.includes(cityId) ? current.filter((id) => id !== cityId) : [...current, cityId],
    )
  }

  const next = () => {
    if (step < 4) {
      setStep((value) => value + 1)
      return
    }
    const circuit = addCircuit({
      showId: selectedShow,
      cityIds: selectedCities,
      contractorNames: selectedContractors,
      opportunityId: state?.opportunityId,
    })
    toast.success('Proposta publicada e convites enviados.')
    navigate(`/circuitos/${circuit.id}`)
  }

  return (
    <div>
      <PageHeader
        title="Novo circuito"
        subtitle={
          state?.opportunityId
            ? 'Circuito iniciado a partir de uma oportunidade automática do sistema.'
            : 'Monte paradas, convide contratantes e publique a proposta.'
        }
      />
      <div className="p-4 md:p-8">
        <Card interactive={false}>
          <div className="mb-6 grid gap-2 md:grid-cols-4">
            {['Espetáculo', 'Paradas', 'Contratantes', 'Confirmar'].map((label, index) => (
              <button
                key={label}
                className={`rounded-full px-3 py-2 text-center text-sm font-bold ${
                  index + 1 === step ? 'bg-[var(--color-primary-700)] text-white' : 'bg-[var(--color-cream)]'
                }`}
                onClick={() => setStep(index + 1)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>
          {step === 1 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {shows.map((show) => (
                <button
                  key={show.id}
                  className={`rounded-2xl border p-4 text-left hover:border-[var(--color-secondary-300)] ${
                    selectedShow === show.id
                      ? 'border-[var(--color-secondary-300)] bg-[var(--color-secondary-50)]'
                      : 'border-[var(--color-cream-dark)]'
                  }`}
                  onClick={() => setSelectedShow(show.id)}
                  type="button"
                >
                  <strong>{show.name}</strong>
                  <p className="text-sm text-[var(--color-warm-gray)]">{show.group}</p>
                </button>
              ))}
            </div>
          ) : step === 2 ? (
            <div className="grid gap-3 md:grid-cols-3">
              {municipalities.slice(0, 9).map((city) => (
                <button
                  key={city.id}
                  className={`rounded-2xl p-4 text-left ${
                    selectedCities.includes(city.id)
                      ? 'bg-[var(--color-primary-100)] ring-2 ring-[var(--color-primary-300)]'
                      : 'bg-[var(--color-cream)]'
                  }`}
                  onClick={() => toggleCity(city.id)}
                  type="button"
                >
                  <strong>{city.name}</strong>
                  <p className="text-xs text-[var(--color-warm-gray)]">{city.venues[0]}</p>
                </button>
              ))}
            </div>
          ) : step === 3 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {['Sesc Caruaru', 'Sesc Arcoverde', 'Prefeitura de Olinda', 'Escola Mestre Vitalino'].map((name) => (
                <label key={name} className="flex items-center gap-3 rounded-2xl bg-[var(--color-cream)] p-4">
                  <input
                    checked={selectedContractors.includes(name)}
                    className="accent-[var(--color-secondary-300)]"
                    onChange={(event) =>
                      setSelectedContractors((current) =>
                        event.target.checked ? [...current, name] : current.filter((item) => item !== name),
                      )
                    }
                    type="checkbox"
                  />
                  <span className="font-semibold">{name}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[var(--color-cream)] p-5 text-sm">
              <h3 className="font-bold">Resumo da proposta</h3>
              <p className="text-[var(--color-warm-gray)]">
                {selectedCities.length} paradas selecionadas, {selectedContractors.length} contratantes convidados e
                economia estimada de 31%.
              </p>
            </div>
          )}
          <Button className="mt-6" onClick={next}>
            {step < 4 ? 'Continuar' : 'Publicar e enviar convites'}
          </Button>
        </Card>
      </div>
    </div>
  )
}
