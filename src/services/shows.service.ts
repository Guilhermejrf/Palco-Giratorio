import { shows } from '../constants/mockData'

export const showsService = {
  list: async () => shows,
  getById: async (id: string) => shows.find((show) => show.id === id) ?? null,
  checkCompatibility: async (showId: string, venueId: string) => ({
    showId,
    venueId,
    itemsCovered: ['Palco', 'Som básico', 'Energia'],
    itemsMissing: ['Operador de luz extra'],
    localResources: ['Técnico local', '12 refletores LED'],
    estimatedFreightCost: 980,
    compatibilityScore: 84,
  }),
}
