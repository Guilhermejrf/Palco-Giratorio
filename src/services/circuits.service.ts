import { circuits, opportunities } from '../constants/mockData'

export const circuitsService = {
  list: async () => circuits,
  opportunities: async () => opportunities,
  getById: async (id: string) => circuits.find((circuit) => circuit.id === id) ?? null,
}
