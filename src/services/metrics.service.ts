import { pulseEvolution, regionMetrics } from '../constants/mockData'
import { municipalities } from '../constants/municipalities'

export const metricsService = {
  summary: async () => ({
    presentations: 123,
    activeCities: municipalities.filter((city) => city.status !== 'off').length,
    circulatingShows: 27,
    schoolsReached: 74,
    costPerSpectator: 18.9,
  }),
  regions: async () => regionMetrics,
  evolution: async () => pulseEvolution,
}
