import L from 'leaflet'
import { useMemo } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, Tooltip } from 'react-leaflet'
import { circuits, resources } from '../../../constants/mockData'
import { PERNAMBUCO_BOUNDS, PERNAMBUCO_CENTER } from '../../../constants/municipalities'
import { useMapData } from '../../../hooks/useMap'
import { useMapStore } from '../../../stores/mapStore'
import { cityStatusColor, pulseLabel } from '../../../utils/colorUtils'
import { markerRadius } from '../../../utils/geoUtils'
import { CircuitRoute } from '../CircuitRoute/CircuitRoute'

interface MapVivoProps {
  compact?: boolean
}

const pulseIcon = L.divIcon({
  className: '',
  html: '<span class="pulse-marker block h-4 w-4 rounded-full bg-[var(--color-city-pulse)]"></span>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export const MapVivo = ({ compact = false }: MapVivoProps) => {
  const { filteredMunicipalities } = useMapData()
  const selectMunicipality = useMapStore((state) => state.selectMunicipality)
  const showCircuitRoutes = useMapStore((state) => state.showCircuitRoutes)
  const showResourcesLayer = useMapStore((state) => state.showResourcesLayer)

  const markers = useMemo(
    () =>
      filteredMunicipalities.map((municipality) => (
        <CircleMarker
          key={municipality.id}
          center={[municipality.coords.lat, municipality.coords.lng]}
          radius={compact ? markerRadius(municipality.population) * 0.7 : markerRadius(municipality.population)}
          pathOptions={{
            color: '#fff',
            weight: 1.5,
            fillColor: cityStatusColor(municipality.status),
            fillOpacity: 0.9,
          }}
          eventHandlers={{
            click: () => !compact && selectMunicipality(municipality.id),
          }}
        >
          <Tooltip direction="top" offset={[0, -4]}>
            <strong>{municipality.name}</strong>
            <br />
            Índice {municipality.pulseIndex} · {pulseLabel(municipality.status)}
          </Tooltip>
        </CircleMarker>
      )),
    [compact, filteredMunicipalities, selectMunicipality],
  )

  return (
    <div className="h-full w-full" role="application" aria-label="Mapa vivo de Pernambuco">
    <MapContainer
      center={PERNAMBUCO_CENTER}
      zoom={compact ? 6 : 7}
      minZoom={6}
      maxBounds={PERNAMBUCO_BOUNDS}
      scrollWheelZoom
      dragging
      doubleClickZoom
      attributionControl={false}
    >
      <TileLayer url={import.meta.env.VITE_LEAFLET_TILE_URL || 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'} />
      {markers}
      {filteredMunicipalities
        .filter((municipality) => municipality.status === 'pulse')
        .map((municipality) => (
          <Marker
            key={`pulse-${municipality.id}`}
            position={[municipality.coords.lat, municipality.coords.lng]}
            icon={pulseIcon}
            interactive={false}
          />
        ))}
      {!compact && showCircuitRoutes
        ? circuits.filter((circuit) => circuit.status !== 'COMPLETED').map((circuit) => (
            <CircuitRoute key={circuit.id} circuit={circuit} />
          ))
        : null}
      {!compact && showResourcesLayer
        ? resources.map((resource) => (
            <CircleMarker
              key={resource.id}
              center={[resource.coords.lat, resource.coords.lng]}
              radius={10}
              pathOptions={{ color: '#2E5F7E', fillColor: '#A8CDE8', fillOpacity: 0.55 }}
            >
              <Popup>
                <strong>{resource.name}</strong>
                <br />
                {resource.type} · {resource.city}
              </Popup>
            </CircleMarker>
          ))
        : null}
    </MapContainer>
    </div>
  )
}
