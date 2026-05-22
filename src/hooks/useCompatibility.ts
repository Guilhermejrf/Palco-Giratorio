import { useQuery } from '@tanstack/react-query'
import { showsService } from '../services/shows.service'

export const useCompatibility = (showId: string, venueId: string) =>
  useQuery({
    queryKey: ['compatibility', showId, venueId],
    queryFn: () => showsService.checkCompatibility(showId, venueId),
    enabled: Boolean(showId && venueId),
  })
