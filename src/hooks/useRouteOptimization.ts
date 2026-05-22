import { useMutation } from '@tanstack/react-query'
import { logisticsService } from '../services/logistics.service'

export const useRouteOptimization = () =>
  useMutation({
    mutationFn: logisticsService.optimizeRoute,
  })
