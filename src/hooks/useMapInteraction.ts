import { useCallback } from 'react'
import type { Map as LeafletMap } from 'leaflet'
import type { Coordinates } from '../types/map.types'

export const useMapInteraction = (mapRef: React.MutableRefObject<LeafletMap | null>) => {
  const flyTo = useCallback(
    (coords: Coordinates) => mapRef.current?.flyTo([coords.lat, coords.lng], 10, { duration: 0.8 }),
    [mapRef],
  )

  const highlight = useCallback((municipalityId: string) => {
    document.querySelector(`[data-municipality="${municipalityId}"]`)?.classList.add('is-highlighted')
  }, [])

  const pulse = useCallback((municipalityId: string) => {
    document.querySelector(`[data-municipality="${municipalityId}"]`)?.classList.add('is-pulsing')
  }, [])

  return { flyTo, highlight, pulse }
}
