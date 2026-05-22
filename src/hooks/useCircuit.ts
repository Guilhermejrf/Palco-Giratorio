import { useQuery } from '@tanstack/react-query'
import { circuitsService } from '../services/circuits.service'

export const useCircuits = () =>
  useQuery({
    queryKey: ['circuits'],
    queryFn: circuitsService.list,
  })
