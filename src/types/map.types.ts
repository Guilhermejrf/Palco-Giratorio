export type CityPulseStatus = 'off' | 'low' | 'medium' | 'high' | 'pulse'

export interface Coordinates {
  lat: number
  lng: number
}

export interface Municipality {
  id: string
  name: string
  region: string
  coords: Coordinates
  population: number
  pulseIndex: number
  status: CityPulseStatus
  daysSinceLastEvent: number
  activeCircuits: string[]
  venues: string[]
  resources: string[]
  schools: number
  lastEvents: Array<{ date: string; title: string; language: string }>
}

export interface MapFilters {
  language: string
  region: string
  period: string
  status: string
}
