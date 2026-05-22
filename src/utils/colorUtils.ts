import type { CityPulseStatus } from '../types/map.types'

export const cityStatusColor = (status: CityPulseStatus) => {
  const map: Record<CityPulseStatus, string> = {
    off: 'var(--color-city-off)',
    low: 'var(--color-city-low)',
    medium: 'var(--color-city-medium)',
    high: 'var(--color-city-high)',
    pulse: 'var(--color-city-pulse)',
  }
  return map[status]
}

export const pulseLabel = (status: CityPulseStatus) => {
  const map: Record<CityPulseStatus, string> = {
    off: 'Sem circulação',
    low: 'Baixa atividade',
    medium: 'Ativa',
    high: 'Circuito em andamento',
    pulse: 'Circuito agora',
  }
  return map[status]
}
