import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { municipalities } from '../../../constants/municipalities'
import { useMapStore } from '../../../stores/mapStore'
import { Button } from '../../ui/Button/Button'

export const LowPulseCities = () => {
  const navigate = useNavigate()
  const selectMunicipality = useMapStore((state) => state.selectMunicipality)
  const cities = [...municipalities].sort((a, b) => a.pulseIndex - b.pulseIndex).slice(0, 10)

  const programCity = (cityId: string, cityName: string) => {
    selectMunicipality(cityId)
    toast.success(`${cityName} aberto no mapa para programação.`)
    navigate('/mapa')
  }

  return (
    <div className="overflow-auto rounded-2xl border border-[var(--color-cream-dark)] bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-[var(--color-cream)] text-xs uppercase tracking-[0.1em] text-[var(--color-warm-gray)]">
          <tr>
            <th className="p-3">#</th>
            <th className="p-3">Município</th>
            <th className="p-3">Região</th>
            <th className="p-3">Índice</th>
            <th className="p-3">Dias sem evento</th>
            <th className="p-3">Ação</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city, index) => (
            <tr key={city.id} className={city.pulseIndex < 20 ? 'bg-[var(--color-secondary-50)]' : ''}>
              <td className="p-3 font-mono">{index + 1}</td>
              <td className="p-3 font-bold">{city.name}</td>
              <td className="p-3">{city.region}</td>
              <td className="p-3 font-mono">{city.pulseIndex}</td>
              <td className="p-3">{city.daysSinceLastEvent}</td>
              <td className="p-3">
                <Button onClick={() => programCity(city.id, city.name)} variant="secondary">
                  Programar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
