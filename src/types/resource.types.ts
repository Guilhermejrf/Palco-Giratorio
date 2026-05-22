import type { Coordinates } from './map.types'

export type ResourceType =
  | 'Som'
  | 'Luz'
  | 'Palco'
  | 'Transporte'
  | 'Hospedagem'
  | 'Técnicos'
  | 'Espaços'
  | 'Outros'

export interface Resource {
  id: string
  name: string
  type: ResourceType
  city: string
  region: string
  owner: string
  availability: 'available' | 'busy' | 'by_schedule'
  pricePerDay?: number
  networkShared: boolean
  rating?: number
  coords: Coordinates
}
