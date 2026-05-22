import { Polyline } from 'react-leaflet'
import type { Circuit } from '../../../types/circuit.types'

interface CircuitRouteProps {
  circuit: Circuit
}

export const CircuitRoute = ({ circuit }: CircuitRouteProps) => (
  <Polyline
    positions={circuit.stops.map((stop) => [stop.coords.lat, stop.coords.lng])}
    pathOptions={{ color: '#C4755A', weight: 3, opacity: 0.8, dashArray: '8 8' }}
  />
)
