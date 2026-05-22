import { useMemo } from 'react'
import { useMapStore } from '../stores/mapStore'

export const useMapData = () => {
  const municipalities = useMapStore((state) => state.municipalities)
  const filters = useMapStore((state) => state.activeFilters)

  const filteredMunicipalities = useMemo(
    () =>
      municipalities.filter((municipality) => {
        const regionMatches = !filters.region || municipality.region === filters.region
        const statusMatches = !filters.status || municipality.status === filters.status
        const languageMatches =
          !filters.language ||
          municipality.lastEvents.some(
            (event) => event.language.toLowerCase() === filters.language.toLowerCase(),
          )
        return regionMatches && statusMatches && languageMatches
      }),
    [filters.language, filters.region, filters.status, municipalities],
  )

  return { filteredMunicipalities, filters }
}
