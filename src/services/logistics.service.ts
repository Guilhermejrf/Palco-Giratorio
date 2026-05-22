import type { CircuitStopDraft } from '../types/circuit.types'

export const logisticsService = {
  optimizeRoute: async (stops: CircuitStopDraft[]) => {
    await new Promise((resolve) => setTimeout(resolve, 700))
    return [...stops].sort((a, b) => a.municipalityId.localeCompare(b.municipalityId))
  },
}
