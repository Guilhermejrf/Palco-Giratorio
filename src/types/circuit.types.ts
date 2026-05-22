import type { Coordinates } from './map.types'

export type CircuitStatus = 'IN_PROGRESS' | 'PLANNING' | 'OPEN' | 'COMPLETED'

export interface CircuitStop {
  id: string
  municipalityId: string
  municipality: string
  venue: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled'
  coords: Coordinates
  distanceFromPreviousKm?: number
  travelTime?: string
}

export interface CostShare {
  contractor: string
  value: number
  color: string
}

export interface Circuit {
  id: string
  name: string
  status: CircuitStatus
  region: string
  showId: string
  showName: string
  group: string
  startDate: string
  endDate: string
  stops: CircuitStop[]
  contractors: string[]
  totalCost: number
  costShares: CostShare[]
  confirmedStops: number
}

export interface CircuitOpportunity {
  id: string
  region: string
  showName: string
  group: string
  municipalities: string[]
  period: string
  estimatedSavings: number
  unitsInterested: number
}

export interface CircuitStopDraft {
  id: string
  municipalityId: string
  venueId: string
}

export interface DraftCircuit {
  showId: string
  stops: CircuitStopDraft[]
  contractors: Array<{ id: string; type: string }>
}

export interface CostSimulation {
  total: number
  perContractor: number
}
