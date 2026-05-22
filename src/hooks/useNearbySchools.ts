import { useQuery } from '@tanstack/react-query'
import { schoolsService } from '../services/schools.service'

export const useNearbySchools = (enabled = true) =>
  useQuery({
    queryKey: ['nearby-schools'],
    queryFn: schoolsService.nearCircuit,
    enabled,
  })
