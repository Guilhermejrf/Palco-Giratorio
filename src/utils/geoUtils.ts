import type { Municipality } from '../types/map.types'

export const markerRadius = (population: number) => Math.min(18, Math.max(6, Math.sqrt(population) / 72))

export const routeFromMunicipalities = (municipalities: Municipality[]) =>
  municipalities.map((municipality) => [municipality.coords.lat, municipality.coords.lng] as [number, number])
